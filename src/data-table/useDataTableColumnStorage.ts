import {useCallback, useMemo} from "react";
import {StorageType, useStorage} from "../storage";
import {defined} from "../utils";
import {DataTableColumn} from "./DataTable";

/**
 * Hook for persisting DataTable column visibility to browser storage.
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
