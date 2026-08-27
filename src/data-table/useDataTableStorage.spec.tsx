/**
 * @jest-environment jsdom
 */

import * as React from "react";
import {useEffect} from "react";
import {act, create, ReactTestRenderer} from "react-test-renderer";
import {DataTableColumn} from "./DataTable";
import {DataTableStorage, useDataTableStorage, UseDataTableStorageResult} from "./useDataTableStorage";

const KEY = "test-table";

const columns: ReadonlyArray<DataTableColumn<unknown>> = [
	{field: "name", label: "Name", sortable: true},
	{field: "tags", label: "Tags"},
];

beforeEach(() => {
	localStorage.clear();
	sessionStorage.clear();
});

function persist(value: DataTableStorage, storage: Storage = localStorage) {
	storage.setItem(KEY, JSON.stringify(value));
}

function readPersisted(storage: Storage = localStorage): DataTableStorage | undefined {
	const serialized = storage.getItem(KEY);
	return serialized ? JSON.parse(serialized) : undefined;
}

/** Renders a hook in a test component and records its result of every render. */
function renderHook<T>(useHook: () => T) {
	const renders: T[] = [];

	function Harness() {
		renders.push(useHook());
		return null;
	}

	let renderer: ReactTestRenderer;
	act(() => {
		renderer = create(<Harness />);
	});

	return {
		renders,
		last: () => renders[renders.length - 1],
		rerender: () =>
			act(() => {
				renderer.update(<Harness />);
			}),
	};
}

describe("useDataTableStorage", () => {
	describe("parameters", () => {
		test("uses built-in defaults without a second parameter", () => {
			const {last} = renderHook(() => useDataTableStorage(KEY));

			expect(last()).toMatchObject({pageIndex: 0, pageSize: 10, sortDirection: "asc"});
		});

		test("treats a string parameter as storage type", () => {
			persist({pageIndex: 3}, sessionStorage);

			const {last} = renderHook(() => useDataTableStorage(KEY, "session"));

			expect(last().pageIndex).toBe(3);
		});

		test("treats a plain storage object as defaults (backwards compatible)", () => {
			const {last} = renderHook(() => useDataTableStorage(KEY, {pageSize: 25, sortField: "name"}));

			expect(last()).toMatchObject({pageSize: 25, sortField: "name"});
		});

		test("applies defaults and storage type from an options object", () => {
			const {last} = renderHook(() =>
				useDataTableStorage(KEY, {defaults: {pageSize: 50}, storageType: "session"})
			);

			expect(last().pageSize).toBe(50);

			act(() => last().onPageChange({pageIndex: 1, pageSize: 50, totalElements: 100}));

			expect(readPersisted(sessionStorage)).toMatchObject({pageIndex: 1});
			expect(readPersisted(localStorage)).toBeUndefined();
		});
	});

	describe("sort field validation", () => {
		test("keeps a persisted sort field when no columns are given", () => {
			persist({sortField: "tags", sortDirection: "desc"});

			const {last} = renderHook(() => useDataTableStorage(KEY));

			expect(last().sortField).toBe("tags");
			expect(readPersisted()).toMatchObject({sortField: "tags"});
		});

		test("keeps the sort field of a sortable column", () => {
			persist({sortField: "name", sortDirection: "desc"});

			const {last} = renderHook(() => useDataTableStorage(KEY, {columns}));

			expect(last()).toMatchObject({sortField: "name", sortDirection: "desc"});
			expect(readPersisted()).toMatchObject({sortField: "name"});
		});

		test("discards the sort field of a column that is no longer sortable", () => {
			persist({pageIndex: 2, sortField: "tags", sortDirection: "desc"});

			const {last} = renderHook(() => useDataTableStorage(KEY, {columns}));

			expect(last().sortField).toBeUndefined();
			// the remaining settings survive, in memory and in storage
			expect(last().pageIndex).toBe(2);
			expect(readPersisted()).toEqual({pageIndex: 2, sortDirection: "desc"});
		});

		test("discards the sort field of a removed column", () => {
			persist({sortField: "no-such-column"});

			const {last} = renderHook(() => useDataTableStorage(KEY, {columns}));

			expect(last().sortField).toBeUndefined();
			expect(readPersisted()).toEqual({});
		});

		test("is not written back by a consumer that resets the page in a mount effect", () => {
			persist({pageIndex: 2, sortField: "tags"});

			// a consumer that resets the page index in a mount effect
			const renders: UseDataTableStorageResult[] = [];
			function Harness() {
				const storage = useDataTableStorage(KEY, {columns});
				renders.push(storage);

				useEffect(() => {
					storage.onPageChange({pageIndex: 0, pageSize: storage.pageSize ?? 10, totalElements: 0});
				}, []);

				return null;
			}
			act(() => {
				create(<Harness />);
			});

			// no render ever saw the invalid sort field ...
			expect(renders.every(render => render.sortField === undefined)).toBe(true);
			// ... and the page reset did not write it back
			expect(readPersisted()).toMatchObject({pageIndex: 0});
			expect(readPersisted()?.sortField).toBeUndefined();
		});

		test("keeps a persisted sort field while the columns are still empty", () => {
			persist({pageIndex: 2, sortField: "tags", sortDirection: "desc"});

			// a consumer whose columns are built from an async permission or feature flag
			const {last} = renderHook(() => useDataTableStorage(KEY, {columns: []}));

			expect(last().sortField).toBe("tags");
			expect(readPersisted()).toMatchObject({sortField: "tags"});
		});

		test("discards the sort field once the columns arrive", () => {
			persist({sortField: "tags", sortDirection: "desc"});

			let currentColumns: ReadonlyArray<DataTableColumn<unknown>> = [];
			const {last, renders, rerender} = renderHook(() => useDataTableStorage(KEY, {columns: currentColumns}));

			expect(last().sortField).toBe("tags");

			currentColumns = columns;
			rerender();

			expect(last().sortField).toBeUndefined();
			expect(readPersisted()?.sortField).toBeUndefined();
			expect(renders.length).toBeGreaterThan(1);
		});

		test("deletes the entry when only the sort field distinguished it from the defaults", () => {
			persist({pageIndex: 0, pageSize: 10, sortDirection: "asc", sortField: "tags"});

			const {last} = renderHook(() => useDataTableStorage(KEY, {columns}));

			expect(last().sortField).toBeUndefined();
			// `useStorage` deletes an entry that equals the defaults, the cleanup must not pin one
			expect(localStorage.getItem(KEY)).toBeNull();
		});

		test("leaves an unparsable persisted value to useStorage", () => {
			localStorage.setItem(KEY, "not json");
			// useStorage warns about the unparsable value and falls back to the defaults
			const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

			const {last} = renderHook(() => useDataTableStorage(KEY, {columns}));

			expect(warn).toHaveBeenCalled();
			warn.mockRestore();

			expect(localStorage.getItem(KEY)).toBe("not json");
			expect(last()).toMatchObject({pageIndex: 0, pageSize: 10});
		});
	});

	describe("onSort", () => {
		test("sorts ascending by a newly selected field", () => {
			const {last} = renderHook(() => useDataTableStorage(KEY, {columns}));

			act(() => last().onSort("name"));

			expect(last()).toMatchObject({sortField: "name", sortDirection: "asc"});
			expect(readPersisted()).toMatchObject({sortField: "name", sortDirection: "asc"});
		});

		test("toggles the direction of the current sort field", () => {
			persist({sortField: "name", sortDirection: "asc"});

			const {last} = renderHook(() => useDataTableStorage(KEY, {columns}));

			act(() => last().onSort("name"));
			expect(last().sortDirection).toBe("desc");

			act(() => last().onSort("name"));
			expect(last().sortDirection).toBe("asc");
		});

		test("ignores a field that no sortable column matches", () => {
			// the columns passed to the hook and the ones rendered by the DataTable diverged
			const {last} = renderHook(() => useDataTableStorage(KEY, {columns}));
			const setItem = jest.spyOn(Storage.prototype, "setItem");

			act(() => last().onSort("tags"));

			// not even written and cleaned up again - the click is simply a no-op
			expect(setItem).not.toHaveBeenCalledWith(KEY, expect.stringContaining("tags"));
			setItem.mockRestore();

			expect(last().sortField).toBeUndefined();
			expect(readPersisted()?.sortField).toBeUndefined();
		});

		test("does not toggle the direction of a discarded sort field", () => {
			persist({sortField: "tags", sortDirection: "desc"});

			const {last} = renderHook(() => useDataTableStorage(KEY, {columns}));

			// the user clicks the header of a column that is still sortable
			act(() => last().onSort("name"));

			expect(last()).toMatchObject({sortField: "name", sortDirection: "asc"});
		});
	});

	test("keeps onPageChange and onSort stable across renders and updates", () => {
		const {renders, last, rerender} = renderHook(() => useDataTableStorage(KEY, {columns}));

		const {onPageChange, onSort} = renders[0];

		rerender();
		act(() => last().onSort("name"));

		expect(renders.length).toBeGreaterThan(1);
		expect(renders.every(render => render.onPageChange === onPageChange && render.onSort === onSort)).toBe(true);
	});
});
