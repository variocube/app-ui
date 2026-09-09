/**
 * @jest-environment jsdom
 */

import * as React from "react";
import {act, create, ReactTestRenderer} from "react-test-renderer";
import {DataTableColumn} from "./DataTable";
import {useDataTableColumnStorage} from "./useDataTableColumnStorage";

const KEY = "test-columns";

const name: DataTableColumn<unknown> = {field: "name", label: "Name", default: true};
const price: DataTableColumn<unknown> = {field: "price", label: "Price", default: true};
const tags: DataTableColumn<unknown> = {field: "tags", label: "Tags"};

beforeEach(() => {
	localStorage.clear();
});

// as in the other specs of this PR: a failing assertion must not leak a spy into later tests
afterEach(() => {
	jest.restoreAllMocks();
});

function renderHook(available: () => ReadonlyArray<DataTableColumn<unknown>>) {
	const renders: Array<ReturnType<typeof useDataTableColumnStorage>> = [];

	function Harness() {
		renders.push(useDataTableColumnStorage(KEY, available()));
		return null;
	}

	let renderer: ReactTestRenderer;
	act(() => {
		renderer = create(<Harness />);
	});

	return {
		last: () => renders[renders.length - 1],
		rerender: () =>
			act(() => {
				renderer.update(<Harness />);
			}),
	};
}

describe("useDataTableColumnStorage", () => {
	test("starts with the columns marked as default", () => {
		const {last} = renderHook(() => [name, tags]);

		expect(last().columns).toEqual([name]);
	});

	test("keeps a selection that happens to equal the default when more columns arrive", () => {
		// available columns are commonly derived from a permission or capability fetch, so the default
		// selection grows underneath a user who has already made a choice
		let available: ReadonlyArray<DataTableColumn<unknown>> = [name, tags];
		const {last, rerender} = renderHook(() => available);

		act(() => last().setColumns([name]));

		available = [name, price, tags];
		rerender();

		expect(last().columns).toEqual([name]);
	});

	test("adopts a grown default selection for a user who never chose", () => {
		let available: ReadonlyArray<DataTableColumn<unknown>> = [name, tags];
		const {last, rerender} = renderHook(() => available);

		available = [name, price, tags];
		rerender();

		expect(last().columns).toEqual([name, price]);
	});

	test("keeps an empty selection instead of reverting to the default", () => {
		const {last} = renderHook(() => [name, tags]);

		act(() => last().setColumns([]));

		expect(last().columns).toEqual([]);
	});
});
