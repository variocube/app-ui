import {SortDirection} from "@mui/material";
import {useCallback, useMemo, useRef} from "react";
import {storage as browserStorage, StorageType, useStorage} from "../storage";
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

function isSortFieldValid<T>(sortField?: string, columns?: ReadonlyArray<DataTableColumn<T>>) {
	return !sortField || !columns || columns.some(column => column.sortable && column.field == sortField);
}

function withValidSortField<T, S extends DataTableStorage>(
	storage: S,
	columns?: ReadonlyArray<DataTableColumn<T>>,
): S {
	return isSortFieldValid(storage.sortField, columns) ? storage : {...storage, sortField: undefined};
}

/**
 * Removes a sort field that does not match a sortable column from the persisted value.
 *
 * Consumers keep their sort settings in browser storage indefinitely, while their column definitions
 * evolve: a field that was sortable once sticks around after the column stopped being sortable (or was
 * renamed or removed) and keeps breaking the server-side query on every load, with no way for the user
 * to recover.
 */
function purgeInvalidSortField<T>(
	key: string,
	columns?: ReadonlyArray<DataTableColumn<T>>,
	storageType?: StorageType,
) {
	if (!columns) {
		return;
	}
	const serialized = browserStorage.read(key, storageType);
	if (!serialized) {
		return;
	}
	try {
		const stored = JSON.parse(serialized) as DataTableStorage | null;
		if (stored && !isSortFieldValid(stored.sortField, columns)) {
			browserStorage.write(key, JSON.stringify({...stored, sortField: undefined}), storageType);
		}
	} catch (e) {
		// leave an unparsable value to the fallback handling of `useStorage`
	}
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

	// The purge has to happen while rendering, before `useStorage` below reads the value: doing it in an
	// effect is too late, because `onPageChange`/`onSort` of this render would already have handed the
	// invalid field out and the consumer may write it back (e.g. a page reset in a mount effect).
	const purgedKey = useRef<string>();
	if (purgedKey.current !== key) {
		purgedKey.current = key;
		purgeInvalidSortField(key, columns, storageType);
	}

	const [storage, setStorage] = useStorage<DataTableStorage>(key, {
		pageIndex: 0,
		pageSize: 10,
		sortDirection: "asc",
		...defaults,
	}, storageType);

	// Guard the value we hand out as well: the columns can change after the purge has run, e.g. when
	// they depend on a permission or a feature flag that is resolved asynchronously.
	const sortFieldValid = isSortFieldValid(storage.sortField, columns);
	const validated = useMemo(
		() => sortFieldValid ? storage : {...storage, sortField: undefined},
		[storage, sortFieldValid],
	);

	// Keep the columns out of the callback dependencies: they are commonly built inline, so a new array
	// on every render would give the callbacks a new identity on every render.
	const columnsRef = useRef(columns);
	columnsRef.current = columns;

	const onPageChange = useCallback(({pageSize, pageIndex}: DataTablePage) => {
		setStorage(previous => ({...withValidSortField(previous, columnsRef.current), pageSize, pageIndex}));
	}, [setStorage]);

	const onSort = useCallback((field: string) => {
		setStorage(previous => {
			const current = withValidSortField(previous, columnsRef.current);
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
