import {useStorage} from "../storage";
import {useCallback, useMemo} from "react";
import {DataTableColumn} from "./DataTable";
import {defined} from "../utils";

export function useDataTableColumnStorage<T>(key: string, availableColumns: ReadonlyArray<DataTableColumn<T>>) {

    const defaultColumns = useMemo(() => availableColumns
        .filter(c => c.default)
        .map(c => c.field), [availableColumns]);

    const [storage, setStorage] = useStorage(key, defaultColumns);

    const columns = storage
        .map(c => availableColumns.find(a => a.field == c))
        .filter(defined);

    const setColumns = useCallback((columns: ReadonlyArray<DataTableColumn<T>>) => {
        setStorage(columns.map(c => c.field));
    }, []);

    return {
        columns,
        setColumns
    }
}