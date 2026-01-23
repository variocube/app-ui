/**
 * @jest-environment jsdom
 */

import {DataTableStorage, DataTableStorageOptions} from "./useDataTableStorage";

// Test the type guard function logic
function isDataTableStorageOptions(value: unknown): value is DataTableStorageOptions {
	return typeof value === "object" && value !== null && ("defaults" in value || "storageType" in value);
}

describe("useDataTableStorage parameter parsing", () => {
	describe("isDataTableStorageOptions type guard", () => {
		test("returns false for undefined", () => {
			expect(isDataTableStorageOptions(undefined)).toBe(false);
		});

		test("returns false for null", () => {
			expect(isDataTableStorageOptions(null)).toBe(false);
		});

		test("returns false for string (StorageType)", () => {
			expect(isDataTableStorageOptions("local")).toBe(false);
			expect(isDataTableStorageOptions("session")).toBe(false);
		});

		test("returns false for DataTableStorage (backwards compat object)", () => {
			const defaults: DataTableStorage = {pageSize: 25, pageIndex: 0};
			expect(isDataTableStorageOptions(defaults)).toBe(false);
		});

		test("returns true for object with defaults property", () => {
			const options: DataTableStorageOptions = {defaults: {pageSize: 25}};
			expect(isDataTableStorageOptions(options)).toBe(true);
		});

		test("returns true for object with storageType property", () => {
			const options: DataTableStorageOptions = {storageType: "session"};
			expect(isDataTableStorageOptions(options)).toBe(true);
		});

		test("returns true for object with both defaults and storageType", () => {
			const options: DataTableStorageOptions = {
				defaults: {pageSize: 25},
				storageType: "session",
			};
			expect(isDataTableStorageOptions(options)).toBe(true);
		});
	});

	describe("parameter normalization logic", () => {
		// Test the normalization logic that's used in useDataTableStorage
		function normalizeParams(optionsOrDefaultsOrType?: string | DataTableStorage | DataTableStorageOptions) {
			let defaults: DataTableStorage = {};
			let storageType: string | undefined;

			if (typeof optionsOrDefaultsOrType === "string") {
				storageType = optionsOrDefaultsOrType;
			} else if (isDataTableStorageOptions(optionsOrDefaultsOrType)) {
				defaults = optionsOrDefaultsOrType.defaults ?? {};
				storageType = optionsOrDefaultsOrType.storageType;
			} else if (optionsOrDefaultsOrType) {
				defaults = optionsOrDefaultsOrType;
			}

			return {defaults, storageType};
		}

		test("no second parameter returns empty defaults and undefined storageType", () => {
			const result = normalizeParams();
			expect(result.defaults).toEqual({});
			expect(result.storageType).toBeUndefined();
		});

		test("string parameter is treated as storageType", () => {
			const result = normalizeParams("session");
			expect(result.defaults).toEqual({});
			expect(result.storageType).toBe("session");
		});

		test("DataTableStorage object is treated as defaults (backwards compat)", () => {
			const result = normalizeParams({pageSize: 25, sortField: "name"});
			expect(result.defaults).toEqual({pageSize: 25, sortField: "name"});
			expect(result.storageType).toBeUndefined();
		});

		test("DataTableStorageOptions with defaults only", () => {
			const result = normalizeParams({defaults: {pageSize: 50}});
			expect(result.defaults).toEqual({pageSize: 50});
			expect(result.storageType).toBeUndefined();
		});

		test("DataTableStorageOptions with storageType only", () => {
			const result = normalizeParams({storageType: "session"});
			expect(result.defaults).toEqual({});
			expect(result.storageType).toBe("session");
		});

		test("DataTableStorageOptions with both defaults and storageType", () => {
			const result = normalizeParams({
				defaults: {pageSize: 100, sortDirection: "desc"},
				storageType: "local",
			});
			expect(result.defaults).toEqual({pageSize: 100, sortDirection: "desc"});
			expect(result.storageType).toBe("local");
		});
	});
});
