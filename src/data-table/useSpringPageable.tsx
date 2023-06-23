import {Pageable} from "../Paging";
import {SortDirection} from "@mui/material";
import {useMemo} from "react";

export interface SpringPagingOptions {
    pageIndex?: number;
    pageSize?: number;
    sortField?: string;
    sortDirection?: SortDirection;
}

export function useSpringPageable(options: SpringPagingOptions): Pageable {
    const {
        pageIndex,
        pageSize,
        sortField,
        sortDirection
    } = options;

    return useMemo(() => ({
        pageSize: pageSize ?? 10,
        direction: sortDirection || undefined,
        sort: sortField,
        pageNumber: pageIndex ?? 0,
    }), [pageIndex, pageSize, sortField, sortDirection]);
}