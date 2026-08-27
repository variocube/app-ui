import {SortDirection} from "@mui/material";
import {useCallback, useEffect, useRef} from "react";
import {StorageType, useStorage} from "../storage";
import {DataTableColumn, DataTablePage} from "./DataTable";

export interface DataTableStorage {
	pageIndex?: number;
	pageSize?: number;
	sortField?: string;
	sortDirection?: SortDirection;
}

export interface DataTableStorageOptions<T = unknown> {
	defaults?: DataTableStorage;
	storageType?: StorageType;

	/**
	 * The columns of the data table.
	 *
	 * When provided, a persisted `sortField` that does not match a sortable column is discarded,
	 * both from the returned state and from the browser storage. Pass the full list of available
	 * columns, not only the currently visible ones.
	 *
	 * An empty list is treated like no list at all, so that columns which are only built once an
	 * async permission or feature flag has resolved do not discard a valid sort field in the meantime.
	 */
	columns?: ReadonlyArray<DataTableColumn<T>>;
}

export type UseDataTableStorageResult = DataTableStorage & {
	onPageChange: (page: DataTablePage) => void;
	onSort: (field: string) => void;
};

function isDataTableStorageOptions<T>(value: unknown): value is DataTableStorageOptions<T> {
	return typeof value === "object" && value !== null
		&& ("defaults" in value || "storageType" in value || "columns" in value);
}

/**
 * Whether the given sort field can be used, i.e. whether a sortable column matches it.
 *
 * Without columns - or with an empty list, which is what consumers pass while they are still waiting
 * for an async permission or feature flag - nothing can be decided, so the field is accepted.
 */
function isSortFieldValid<T>(sortField?: string, columns?: ReadonlyArray<DataTableColumn<T>>) {
	if (!sortField || !columns?.length) {
		return true;
	}
	return columns.some(column => column.sortable && column.field == sortField);
}

/** Returns the storage without its sort field, if no sortable column matches it. */
function withValidSortField<T, S extends DataTableStorage>(
	storage: S,
	columns?: ReadonlyArray<DataTableColumn<T>>,
): S {
	return isSortFieldValid(storage.sortField, columns) ? storage : {...storage, sortField: undefined};
}

/**
 * Hook for persisting DataTable state to browser storage.
 *
 * @example
 * // Default - uses localStorage
 * const tableState = useDataTableStorage("my-table");
 *
 * @example
 * // With defaults (backwards compatible)
 * const tableState = useDataTableStorage("my-table", { pageSize: 25 });
 *
 * @example
 * // With sessionStorage
 * const tableState = useDataTableStorage("my-table", "session");
 *
 * @example
 * // With both defaults and storageType
 * const tableState = useDataTableStorage("my-table", { defaults: { pageSize: 25 }, storageType: "session" });
 *
 * @example
 * // With columns: a persisted sort field that no sortable column matches is discarded
 * const tableState = useDataTableStorage("my-table", { columns });
 */
export function useDataTableStorage(key: string): UseDataTableStorageResult;
export function useDataTableStorage(key: string, storageType: StorageType): UseDataTableStorageResult;
export function useDataTableStorage(key: string, defaults: DataTableStorage): UseDataTableStorageResult;
export function useDataTableStorage<T>(key: string, options: DataTableStorageOptions<T>): UseDataTableStorageResult;
export function useDataTableStorage<T>(
	key: string,
	optionsOrDefaultsOrType?: StorageType | DataTableStorage | DataTableStorageOptions<T>,
): UseDataTableStorageResult {
	// Normalize parameters
	let defaults: DataTableStorage = {};
	let storageType: StorageType | undefined;
	let columns: ReadonlyArray<DataTableColumn<T>> | undefined;

	if (typeof optionsOrDefaultsOrType === "string") {
		// It's a StorageType
		storageType = optionsOrDefaultsOrType;
	} else if (isDataTableStorageOptions<T>(optionsOrDefaultsOrType)) {
		// It's DataTableStorageOptions
		defaults = optionsOrDefaultsOrType.defaults ?? {};
		storageType = optionsOrDefaultsOrType.storageType;
		columns = optionsOrDefaultsOrType.columns;
	} else if (optionsOrDefaultsOrType) {
		// It's DataTableStorage (backwards compat)
		defaults = optionsOrDefaultsOrType;
	}

	const [storage, setStorage] = useStorage<DataTableStorage>(key, {
		pageIndex: 0,
		pageSize: 10,
		sortDirection: "asc",
		...defaults,
	}, storageType);

	// The state we hand out never carries an invalid sort field, whatever is persisted.
	const validated = withValidSortField(storage, columns);

	// Keep the columns out of the dependency arrays below: they are commonly built inline, so a new
	// array on every render would give the callbacks a new identity on every render.
	const columnsRef = useRef(columns);
	columnsRef.current = columns;

	// Clean up the persisted value as well, so that an invalid sort field neither lingers for readers
	// outside this hook nor survives until the next write. Writing through `setStorage` keeps the
	// serialization contract of `useStorage` (including deleting an entry that equals the defaults) in
	// one place, and doing it in an effect keeps the write out of the render phase, where it would
	// notify the change listeners of other components while they are rendering.
	const sortFieldValid = isSortFieldValid(storage.sortField, columns);
	useEffect(() => {
		if (!sortFieldValid) {
			setStorage(previous => withValidSortField(previous, columnsRef.current));
		}
	}, [sortFieldValid, setStorage]);

	// The updaters below resolve `previous` from the persisted value instead of the render closure, so
	// concurrent writers cannot resurrect a sort field that has just been discarded.
	const onPageChange = useCallback(({pageSize, pageIndex}: DataTablePage) => {
		setStorage(previous => ({...withValidSortField(previous, columnsRef.current), pageSize, pageIndex}));
	}, [setStorage]);

	const onSort = useCallback((field: string) => {
		setStorage(previous => {
			const current = withValidSortField(previous, columnsRef.current);
			if (!isSortFieldValid(field, columnsRef.current)) {
				// Nothing to do: persisting the field would only produce the kind of invalid sort field
				// that is discarded again on read. Happens when the columns passed to this hook and the
				// ones rendered by the DataTable diverge.
				return current;
			}
			if (current.sortField == field) {
				return {...current, sortDirection: current.sortDirection == "desc" ? "asc" : "desc"};
			}
			return {
				...current,
				sortDirection: "asc",
				sortField: field,
			};
		});
	}, [setStorage]);

	return {
		...validated,
		onPageChange,
		onSort,
	};
}
