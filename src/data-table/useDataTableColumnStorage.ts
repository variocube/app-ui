import {useCallback, useMemo} from "react";
import {StorageType, useStorage} from "../storage";
import {defined} from "../utils";
import {DataTableColumn} from "./DataTable";

/**
 * Hook for persisting DataTable column visibility to browser storage.
 *
 * A persisted selection is only intersected with `availableColumns` on read, never rewritten, so a column
 * that is temporarily missing - not resolved yet, or filtered by permissions - comes back rather than
 * being dropped from the user's settings. A selection the user empties stays empty, including while
 * `availableColumns` is still loading: an emptied selection is a choice, and `useStorage` persists it
 * instead of letting it read as "never chose anything" and reverting to the default columns.
 *
 * @param key - Unique storage key for column settings
 * @param availableColumns - All available columns for this DataTable
 * @param storageType - Optional storage type ('local' or 'session'). Defaults to 'local'.
 */
export function useDataTableColumnStorage<T>(
	key: string,
	availableColumns: ReadonlyArray<DataTableColumn<T>>,
	storageType?: StorageType,
) {
	const defaultColumns = useMemo(() =>
		availableColumns
			.filter(c => c.default)
			.map(c => c.field), [availableColumns]);

	const [storage, setStorage] = useStorage(key, defaultColumns, storageType);

	const columns = storage
		.map(c => availableColumns.find(a => a.field == c))
		.filter(defined);

	const setColumns = useCallback((columns: ReadonlyArray<DataTableColumn<T>>) => {
		setStorage(columns.map(c => c.field));
	}, [setStorage]);

	return {
		columns,
		setColumns,
	};
}
