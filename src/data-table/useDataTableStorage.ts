import {useStorage} from "../storage";
import {SortDirection} from "@mui/material";
import {useCallback} from "react";
import {DataTablePage} from "./DataTable";

export interface DataTableStorage {
    pageIndex?: number;
    pageSize?: number;
    sortField?: string;
    sortDirection?: SortDirection;
}

export function useDataTableStorage(key: string, defaults?: DataTableStorage) {
    const [storage, setStorage] = useStorage<DataTableStorage>(key, {
        pageIndex: 0,
        pageSize: 10,
        sortDirection: "asc",
        ...defaults,
    });

    const onPageChange = useCallback(({pageSize, pageIndex}: DataTablePage) => {
        setStorage({...storage, pageSize, pageIndex});
    }, [storage]);

    const onSort = useCallback((field: string) => {
        if (storage.sortField == field) {
            setStorage({...storage, sortDirection: storage.sortDirection == "desc" ? "asc" : "desc" });
        }
        else {
            setStorage({
                ...storage,
                sortDirection: "asc",
                sortField: field,
            });
        }
    }, [storage]);

    return {
        ...storage,
        onPageChange,
        onSort,
    }
}