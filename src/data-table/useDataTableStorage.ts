import {SortDirection} from "@mui/material";
import {useCallback, useRef} from "react";
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
	 * When provided, a persisted `sortField` that no sortable column matches is hidden from the
	 * returned state, so that it never reaches a query. Pass the full list of available columns, not
	 * only the currently visible ones.
	 *
	 * The persisted value itself is never modified: a column list can be incomplete - not resolved yet,
	 * or filtered down to what a user may see - and hiding the sort field is reversible, while deleting
	 * it would cost the user their setting for good. It comes back as soon as its column does.
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

function hasSortableColumn<T>(field: string, columns: ReadonlyArray<DataTableColumn<T>>) {
	return columns.some(column => column.sortable && column.field == field);
}

/**
 * The sort field to hand out, i.e. the persisted one unless no sortable column matches it.
 *
 * Without columns there is nothing to check against and the field is handed out as persisted. An empty
 * list does hide it: it may just not be resolved yet, and a sort that cannot be applied is better
 * suppressed than sent to a backend that rejects it.
 */
function visibleSortField<T>(sortField?: string, columns?: ReadonlyArray<DataTableColumn<T>>) {
	if (!sortField || !columns) {
		return sortField;
	}
	return hasSortableColumn(sortField, columns) ? sortField : undefined;
}

/**
 * Whether a sort by the given field may be persisted.
 *
 * Without columns - or with a list that is not resolved yet - this cannot be decided, so the click is
 * trusted: the data table rendered that header as sortable.
 */
function canSortBy<T>(field: string, columns?: ReadonlyArray<DataTableColumn<T>>) {
	return !columns?.length || hasSortableColumn(field, columns);
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
 * // With columns: a persisted sort field that no sortable column matches is hidden
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

	// Keep the columns out of the dependency array of `onSort` below: they are commonly built inline, so
	// a new array on every render would give the callback a new identity on every render.
	const columnsRef = useRef(columns);
	columnsRef.current = columns;

	const onPageChange = useCallback(({pageSize, pageIndex}: DataTablePage) => {
		setStorage(previous => ({...previous, pageSize, pageIndex}));
	}, [setStorage]);

	const onSort = useCallback((field: string) => {
		if (!canSortBy(field, columnsRef.current)) {
			// Persisting the field would replace a working sort with one that is hidden again on read.
			// Happens when the columns passed to this hook and the ones rendered by the DataTable diverge
			// - typically because the visible columns were passed instead of the available ones.
			console.warn(`Ignoring sort by "${field}": no sortable column of the data table "${key}" matches it.`);
			return;
		}
		setStorage(previous => {
			// Compare against the visible field, so that a hidden one cannot swallow the click as a
			// direction toggle. The persisted value is written as it is, minus the sort that changes.
			if (visibleSortField(previous.sortField, columnsRef.current) == field) {
				return {...previous, sortDirection: previous.sortDirection == "desc" ? "asc" : "desc"};
			}
			return {
				...previous,
				sortDirection: "asc",
				sortField: field,
			};
		});
	}, [key, setStorage]);

	return {
		...storage,
		// The state we hand out never carries a sort field that no sortable column matches, while the
		// persisted value keeps it: hiding is reversible, deleting would not be.
		sortField: visibleSortField(storage.sortField, columns),
		onPageChange,
		onSort,
	};
}
