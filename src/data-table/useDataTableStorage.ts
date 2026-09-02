import {SortDirection} from "@mui/material";
import {useCallback, useLayoutEffect, useRef} from "react";
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
	 *
	 * A `sortField` configured through `defaults` is never hidden - it states how the initial query is
	 * sorted, which is a different question from whether a header can be clicked - and a hidden one falls
	 * back to it, so the query keeps the declared baseline instead of going out unsorted.
	 *
	 * Note that omitting this option and passing an empty list are opposites: without columns there is
	 * nothing to check against and any sort field is handed out, while an empty list matches nothing and
	 * hides it. So `{columns: query.data?.available}` is unguarded while it loads, and a list that starts
	 * out empty queries unsorted until it resolves - one request more than a list built synchronously.
	 * The page the user is on survives that, because only picking a sort resets it.
	 *
	 * A column list that does not match what the `DataTable` renders makes clicks on the headers it does
	 * not know about no-ops that are logged, not sorts.
	 */
	columns?: ReadonlyArray<DataTableColumn<T>>;
}

export type UseDataTableStorageResult = DataTableStorage & {
	onPageChange: (page: DataTablePage) => void;

	/** Returns `false`, so that a `DataTable` leaves the page index to this hook. */
	onSort: (field: string) => boolean;
};

function isDataTableStorageOptions<T>(value: unknown): value is DataTableStorageOptions<T> {
	return typeof value === "object" && value !== null
		&& ("defaults" in value || "storageType" in value || "columns" in value);
}

/**
 * Whether the data table can sort by the given field: the single rule behind both hiding a persisted
 * sort field and refusing a click on one.
 *
 * Without columns there is nothing to check against, so anything goes - that is the behaviour of this
 * hook before columns could be passed. An empty list, on the other hand, matches nothing: it may just
 * not be resolved yet, and a sort that cannot be applied is better suppressed than sent to a backend
 * that rejects it.
 */
function isSortable<T>(field: string, columns?: ReadonlyArray<DataTableColumn<T>>) {
	return !columns || columns.some(column => column.sortable && column.field == field);
}

/** The sort field to hand out, i.e. the persisted one unless the data table cannot sort by it. */
function visibleSortField<T>(sortField?: string, columns?: ReadonlyArray<DataTableColumn<T>>) {
	if (!sortField || isSortable(sortField, columns)) {
		return sortField;
	}
	return undefined;
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
	// a new array on every render would give the callback a new identity on every render. The mirror is
	// written after the commit, so a render that React discards cannot leave columns behind that were
	// never shown. `defaults.sortField` is a string and compares by value, so it can be a dependency.
	const columnsRef = useRef(columns);
	useLayoutEffect(() => {
		columnsRef.current = columns;
	});

	const defaultSortField = defaults.sortField;

	const onPageChange = useCallback(({pageSize, pageIndex}: DataTablePage) => {
		setStorage(previous => ({...previous, pageSize, pageIndex}));
	}, [setStorage]);

	// Returns `false` throughout: the data table must not reset the page index on top of this hook,
	// which resets it itself when the sort field changes - and must not move the user at all for a
	// click that is refused below.
	const onSort = useCallback((field: string) => {
		if (!isSortable(field, columnsRef.current) && field != defaultSortField) {
			// Persisting the field would replace a working sort with one that is hidden again on read.
			// Happens when the columns passed to this hook and the ones rendered by the DataTable diverge
			// - typically because the visible columns were passed instead of the available ones. This is
			// the rule the value we hand out is masked with, the configured default included: a click on
			// a header the data table shows as sorted has to take effect, or nothing here would.
			console.warn(`Ignoring sort by "${field}": no sortable column of the data table "${key}" matches it.`);
			return false;
		}
		setStorage(previous => {
			// The guard above established that the field is sortable, or the configured default. So a
			// hidden persisted field can only equal it when it is that default - which is the one that
			// has to toggle rather than start over.
			if (previous.sortField == field) {
				return {...previous, sortDirection: previous.sortDirection == "desc" ? "asc" : "desc"};
			}
			// Sorting by another field re-orders the rows under the user, so the page they are on has
			// lost its meaning. `DataTable` cannot decide this on its own: all it sees is the sort field
			// changing, which also happens when a hidden one is revealed.
			return {
				...previous,
				sortDirection: "asc",
				sortField: field,
				pageIndex: 0,
			};
		});
		return false;
	}, [key, defaultSortField, setStorage]);

	// The state we hand out never carries a sort field that no sortable column matches, while the
	// persisted value keeps it: hiding is reversible, deleting would not be. The direction goes with the
	// field, otherwise the data table previews a descending arrow on every header while nothing is
	// sorted at all.
	const isDefaultSortField = Boolean(storage.sortField) && storage.sortField == defaultSortField;
	let sortField = isDefaultSortField ? storage.sortField : visibleSortField(storage.sortField, columns);
	let sortDirection = storage.sortField && !sortField ? undefined : storage.sortDirection;

	if (!sortField && defaultSortField) {
		// Fall back to the sort the consumer configured rather than querying unsorted. That default is
		// exempt from the rule: `sortable` governs whether a header is clickable, while `defaults`
		// states how the initial query is sorted - which may well use a display-only column, or a field
		// that has no column of its own at all. Unlike a persisted value it also cannot go stale behind
		// the consumer's back, because it lives in their code.
		sortField = defaultSortField;
		sortDirection = defaults.sortDirection ?? "asc";
	}

	return {
		...storage,
		sortField,
		sortDirection,
		onPageChange,
		onSort,
	};
}
