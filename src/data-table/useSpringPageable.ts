import {SortDirection} from "@mui/material";
import {useMemo} from "react";
import {SpringPageable} from "../spring";

export interface SpringPagingOptions {
	pageIndex?: number;
	pageSize?: number;
	sortField?: string;
	sortDirection?: SortDirection;
}

export function useSpringPageable(options: SpringPagingOptions): SpringPageable {
	const {
		pageIndex,
		pageSize,
		sortField,
		sortDirection,
	} = options;

	return useMemo(() => ({
		size: pageSize ?? 10,
		sort: sortField ? [`${sortField},${sortDirection || "asc"}`] : undefined,
		page: pageIndex ?? 0,
	}), [pageIndex, pageSize, sortField, sortDirection]);
}
