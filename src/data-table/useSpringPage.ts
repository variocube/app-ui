import {useEffect, useState} from "react";
import {DataTablePage} from "./DataTable";
import {SpringPage} from "../spring";


export function useSpringPage<T>(springPage: SpringPage<T> | undefined) {
    const [rows, setRows] = useState<T[]>([]);
    const [page, setPage] = useState<DataTablePage>();

    useEffect(() => {
        if (springPage) {
            setRows(springPage.content);
            setPage({
                totalElements: springPage.totalElements,
                pageSize: springPage.size,
                pageIndex: springPage.number,
            });
        }
    }, [springPage]);

    return {rows, page} as const;
}