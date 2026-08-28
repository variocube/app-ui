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

// spies are set up inside the tests below; without this, a failing assertion would leak a silenced
// console or a spied storage into every later test in this file
afterEach(() => {
	jest.restoreAllMocks();
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

		test("hides the sort field of a column that is no longer sortable", () => {
			persist({pageIndex: 2, sortField: "tags", sortDirection: "desc"});

			const {last} = renderHook(() => useDataTableStorage(KEY, {columns}));

			expect(last().sortField).toBeUndefined();
			expect(last().pageIndex).toBe(2);
			// the persisted value is not touched: hiding is reversible, deleting would not be
			expect(readPersisted()).toEqual({pageIndex: 2, sortField: "tags", sortDirection: "desc"});
		});

		test("hides a sort field that matches no column at all", () => {
			persist({sortField: "no-such-column", sortDirection: "desc"});

			const {last} = renderHook(() => useDataTableStorage(KEY, {columns}));

			// nothing reaches a query ...
			expect(last().sortField).toBeUndefined();
			// ... but the column list may simply be incomplete, so the preference is not destroyed
			expect(readPersisted()).toEqual({sortField: "no-such-column", sortDirection: "desc"});
		});

		test("restores a hidden sort field when the missing column shows up again", () => {
			persist({sortField: "price", sortDirection: "desc"});

			// a consumer that passes the visible columns instead of the available ones, with the sorted
			// column currently hidden
			let currentColumns: ReadonlyArray<DataTableColumn<unknown>> = columns;
			const {last, rerender} = renderHook(() => useDataTableStorage(KEY, {columns: currentColumns}));

			expect(last().sortField).toBeUndefined();

			// a write while the column is hidden must not drop what it does not know about
			act(() => last().onPageChange({pageIndex: 1, pageSize: 10, totalElements: 100}));
			expect(readPersisted()).toMatchObject({sortField: "price", pageIndex: 1});

			currentColumns = [...columns, {field: "price", label: "Price", sortable: true}];
			rerender();

			expect(last()).toMatchObject({sortField: "price", sortDirection: "desc", pageIndex: 1});
		});

		test("is never handed out, even to a consumer that writes in a mount effect", () => {
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

			// no render ever saw the hidden sort field, so nothing reaches a query
			expect(renders.every(render => render.sortField === undefined)).toBe(true);
			// the page reset went through, and left the persisted sort field alone
			expect(readPersisted()).toMatchObject({pageIndex: 0, sortField: "tags"});
		});

		test("hides the sort field while the columns are still empty, and applies it once they arrive", () => {
			// a consumer whose columns are built from an async permission or feature flag
			persist({pageIndex: 2, sortField: "name", sortDirection: "desc"});

			let currentColumns: ReadonlyArray<DataTableColumn<unknown>> = [];
			const {last, rerender} = renderHook(() => useDataTableStorage(KEY, {columns: currentColumns}));

			// a sort that cannot be applied yet is not sent, but it is not lost either
			expect(last().sortField).toBeUndefined();
			expect(readPersisted()).toMatchObject({sortField: "name"});

			currentColumns = columns;
			rerender();

			expect(last()).toMatchObject({sortField: "name", sortDirection: "desc"});

			// the callbacks have to see the resolved columns too, or the table stays unsortable forever
			const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
			act(() => last().onSort("name"));

			expect(warn).not.toHaveBeenCalled();
			expect(last()).toMatchObject({sortField: "name", sortDirection: "asc"});
		});

		test("keeps a sort field that was configured as the default", () => {
			// `sortable` governs header clicks; a default sort may well use a display-only column or a
			// field the table does not render at all
			const {last} = renderHook(() =>
				useDataTableStorage(KEY, {defaults: {sortField: "createdAt", sortDirection: "desc"}, columns})
			);

			expect(last()).toMatchObject({sortField: "createdAt", sortDirection: "desc"});
		});

		test("hides a persisted sort field even when a default sort is configured", () => {
			persist({sortField: "tags"});

			const {last} = renderHook(() =>
				useDataTableStorage(KEY, {defaults: {sortField: "createdAt"}, columns})
			);

			expect(last().sortField).toBeUndefined();
		});

		test("hides the sort direction along with the sort field", () => {
			persist({sortField: "tags", sortDirection: "desc"});

			const {last} = renderHook(() => useDataTableStorage(KEY, {columns}));

			// a direction without a field makes DataTable preview a descending arrow on every header
			expect(last().sortDirection).toBeUndefined();
		});

		test("keeps the sort direction when nothing is hidden", () => {
			persist({sortField: "name", sortDirection: "desc"});

			const {last} = renderHook(() => useDataTableStorage(KEY, {columns}));

			expect(last().sortDirection).toBe("desc");
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

		test("ignores a field that no sortable column matches, leaving the current sort alone", () => {
			// the columns passed to the hook and the ones rendered by the DataTable diverged
			persist({sortField: "name", sortDirection: "desc"});

			const {last} = renderHook(() => useDataTableStorage(KEY, {columns}));
			const setItem = jest.spyOn(Storage.prototype, "setItem");
			const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

			act(() => last().onSort("tags"));

			// a real no-op: nothing is written, and no listener on the key is notified
			expect(setItem).not.toHaveBeenCalled();
			// a silent no-op would be undiagnosable, so it is reported
			expect(warn).toHaveBeenCalledWith(expect.stringContaining("tags"));
			// and the working sort is untouched
			expect(last()).toMatchObject({sortField: "name", sortDirection: "desc"});
			expect(readPersisted()).toEqual({sortField: "name", sortDirection: "desc"});
		});

		test("ignores a field while the columns are empty, rather than sorting silently", () => {
			// only reachable when the DataTable renders columns the hook was not given: the same rule that
			// hides a sort field must reject the click, otherwise the click is a dead no-op
			const {last} = renderHook(() => useDataTableStorage(KEY, {columns: []}));
			const setItem = jest.spyOn(Storage.prototype, "setItem");
			const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

			act(() => last().onSort("name"));

			expect(setItem).not.toHaveBeenCalled();
			expect(warn).toHaveBeenCalledWith(expect.stringContaining("name"));
			expect(last().sortField).toBeUndefined();
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
