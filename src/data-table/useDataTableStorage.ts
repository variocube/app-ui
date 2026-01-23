import {SortDirection} from "@mui/material";
import {useCallback} from "react";
import {StorageType, useStorage} from "../storage";
import {DataTablePage} from "./DataTable";

export interface DataTableStorage {
	pageIndex?: number;
	pageSize?: number;
	sortField?: string;
	sortDirection?: SortDirection;
}

export interface DataTableStorageOptions {
	defaults?: DataTableStorage;
	storageType?: StorageType;
}

type UseDataTableStorageResult = DataTableStorage & {
	onPageChange: (page: DataTablePage) => void;
	onSort: (field: string) => void;
};

function isDataTableStorageOptions(value: unknown): value is DataTableStorageOptions {
	return typeof value === "object" && value !== null && ("defaults" in value || "storageType" in value);
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
 */
export function useDataTableStorage(key: string): UseDataTableStorageResult;
export function useDataTableStorage(key: string, storageType: StorageType): UseDataTableStorageResult;
export function useDataTableStorage(key: string, defaults: DataTableStorage): UseDataTableStorageResult;
export function useDataTableStorage(key: string, options: DataTableStorageOptions): UseDataTableStorageResult;
export function useDataTableStorage(
	key: string,
	optionsOrDefaultsOrType?: StorageType | DataTableStorage | DataTableStorageOptions,
): UseDataTableStorageResult {
	// Normalize parameters
	let defaults: DataTableStorage = {};
	let storageType: StorageType | undefined;

	if (typeof optionsOrDefaultsOrType === "string") {
		// It's a StorageType
		storageType = optionsOrDefaultsOrType;
	} else if (isDataTableStorageOptions(optionsOrDefaultsOrType)) {
		// It's DataTableStorageOptions
		defaults = optionsOrDefaultsOrType.defaults ?? {};
		storageType = optionsOrDefaultsOrType.storageType;
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

	const onPageChange = useCallback(({pageSize, pageIndex}: DataTablePage) => {
		setStorage({...storage, pageSize, pageIndex});
	}, [storage, setStorage]);

	const onSort = useCallback((field: string) => {
		if (storage.sortField == field) {
			setStorage({...storage, sortDirection: storage.sortDirection == "desc" ? "asc" : "desc"});
		} else {
			setStorage({
				...storage,
				sortDirection: "asc",
				sortField: field,
			});
		}
	}, [storage, setStorage]);

	return {
		...storage,
		onPageChange,
		onSort,
	};
}
