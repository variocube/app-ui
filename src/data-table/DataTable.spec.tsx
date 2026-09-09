/**
 * @jest-environment jsdom
 */

import {SortDirection, TableSortLabel} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import {act, create, ReactTestRenderer} from "react-test-renderer";
import {DataTable, DataTableColumn, DataTablePage} from "./DataTable";
import {useDataTableStorage} from "./useDataTableStorage";

interface Fruit {
	id: number;
	name: string;
	price: number;
}

const rows: ReadonlyArray<Fruit> = [{id: 1, name: "Banana", price: 2.99}];

const columns: ReadonlyArray<DataTableColumn<Fruit>> = [
	{field: "name", label: "Name", sortable: true},
	{field: "price", label: "Price", sortable: true},
];

const page: DataTablePage = {pageIndex: 2, pageSize: 10, totalElements: 100};

beforeEach(() => {
	localStorage.clear();
});

afterEach(() => {
	jest.restoreAllMocks();
});

interface Sort {
	sortField?: string;
	sortDirection?: SortDirection;
}

/** The sort and paging state of a consumer that keeps it itself, instead of using the storage hook. */
interface OwnState extends Sort {
	pageIndex: number;
	pageSize: number;
}

function renderTable(sort: Sort) {
	const onPageChange = jest.fn();
	const onSort = jest.fn();

	function table(sort: Sort) {
		return (
			<DataTable
				columns={columns}
				rows={rows}
				page={page}
				onPageChange={onPageChange}
				onSort={onSort}
				{...sort}
			/>
		);
	}

	let renderer: ReactTestRenderer;
	act(() => {
		renderer = create(table(sort));
	});

	return {
		onPageChange,
		onSort,
		update: (sort: Sort) =>
			act(() => {
				renderer.update(table(sort));
			}),
		/** Clicks the header of a sortable column, the way a user starts a sort. */
		clickHeader: (label: string) =>
			act(() => {
				const header = renderer.root.findAll(node =>
					node.type === TableSortLabel && node.props.children === label
				);
				header[0].props.onClick();
			}),
		/** What the header of a column renders as its sort indicator. */
		indicator: (label: string) => {
			const header = renderer.root.findAll(node => node.type === TableSortLabel && node.props.children === label);
			const {active, direction} = header[0].props;
			return {active, direction};
		},
	};
}

describe("DataTable", () => {
	describe("rendering the sort indicator", () => {
		test("marks only the sorted column, in its direction", () => {
			const {indicator} = renderTable({sortField: "price", sortDirection: "desc"});

			expect(indicator("Price")).toEqual({active: true, direction: "desc"});
			expect(indicator("Name")).toMatchObject({active: false});
		});

		test("previews no direction while nothing is sorted", () => {
			// a direction handed out without a field made every header hover-preview a descending arrow
			const {indicator} = renderTable({});

			expect(indicator("Name")).toEqual({active: false, direction: undefined});
			expect(indicator("Price")).toEqual({active: false, direction: undefined});
		});
	});

	describe("reporting a sort click", () => {
		test("reports the clicked field", () => {
			const {clickHeader, onSort} = renderTable({sortField: "name", sortDirection: "asc"});

			clickHeader("Price");

			expect(onSort).toHaveBeenCalledWith("price");
		});

		test("does not report a page change for a sort click", () => {
			// re-ordered rows do cost the user their page, but the reset belongs to the handler that owns
			// the sort: reported separately it would arrive as a second write and overwrite the first
			const {clickHeader, update, onPageChange} = renderTable({sortField: "name", sortDirection: "asc"});

			clickHeader("Price");
			update({sortField: "price", sortDirection: "asc"});

			expect(onPageChange).not.toHaveBeenCalled();
		});

		test("does not report a page change for a direction-only toggle", () => {
			const {clickHeader, update, onPageChange} = renderTable({sortField: "name", sortDirection: "asc"});

			clickHeader("Name");
			update({sortField: "name", sortDirection: "desc"});

			expect(onPageChange).not.toHaveBeenCalled();
		});

		test("keeps the sort of a consumer that spreads its own state", () => {
			// the ordinary `setS({...s, ...})` pattern, and the shape of `setSearchParams({...params, ...})`:
			// a page change reported alongside the sort would land in the same tick and overwrite it
			let seen: OwnState = {sortField: "name", sortDirection: "asc", pageIndex: 3, pageSize: 10};

			function Harness() {
				const [state, setState] = useState<OwnState>(seen);
				seen = state;
				return (
					<DataTable
						columns={columns}
						rows={rows}
						sortField={state.sortField}
						sortDirection={state.sortDirection}
						page={{pageIndex: state.pageIndex, pageSize: state.pageSize, totalElements: 100}}
						onSort={field => setState({...state, sortField: field, sortDirection: "asc", pageIndex: 0})}
						onPageChange={page => setState({...state, pageIndex: page.pageIndex, pageSize: page.pageSize})}
					/>
				);
			}

			let renderer: ReactTestRenderer;
			act(() => {
				renderer = create(<Harness />);
			});
			act(() => {
				const header = renderer.root.findAll(node =>
					node.type === TableSortLabel && node.props.children === "Price"
				);
				header[0].props.onClick();
			});

			expect(seen).toMatchObject({sortField: "price", sortDirection: "asc", pageIndex: 0});
		});

		test("keeps the page when a sort field appears without a click", () => {
			// `useDataTableStorage` hides a sort field whose column is not sortable (yet) and reveals it
			// once it is - that is not a re-ordering the user asked for, so their page must survive it
			const {update, onPageChange} = renderTable({sortDirection: "asc"});

			update({sortField: "name", sortDirection: "asc"});

			expect(onPageChange).not.toHaveBeenCalled();
		});

		test("keeps the page when the sort field disappears without a click", () => {
			const {update, onPageChange} = renderTable({sortField: "name", sortDirection: "asc"});

			update({sortDirection: "asc"});

			expect(onPageChange).not.toHaveBeenCalled();
		});
	});

	describe("resetting a page index that is out of bounds", () => {
		test("does not report a page change for an empty result set", () => {
			// an empty result set has no pages, so page 0 counts as out of bounds - reporting 0 -> 0 would
			// have a persisting consumer store settings the user never chose
			const onPageChange = jest.fn();
			act(() => {
				create(
					<DataTable
						columns={columns}
						rows={[]}
						page={{pageIndex: 0, pageSize: 10, totalElements: 0}}
						onPageChange={onPageChange}
					/>,
				);
			});

			expect(onPageChange).not.toHaveBeenCalled();
		});

		test("still resets a page index that is out of bounds", () => {
			const onPageChange = jest.fn();
			const outOfBounds = {pageIndex: 3, pageSize: 10, totalElements: 0};
			act(() => {
				create(
					<DataTable columns={columns} rows={[]} page={outOfBounds} onPageChange={onPageChange} />,
				);
			});

			expect(onPageChange).toHaveBeenCalledWith({...outOfBounds, pageIndex: 0});
		});
	});

	describe("through both layers", () => {
		test("leaves the storage untouched when a table with an empty result set is opened", () => {
			// through both layers: `useStorage` persists every write, so a write the library makes on its
			// own would shadow a later change of the consumer's defaults
			const key = "DataTableEmpty";

			function Harness() {
				const {onPageChange, onSort, ...storage} = useDataTableStorage(key, {
					defaults: {pageSize: 10},
					columns,
				});
				return (
					<DataTable
						columns={columns}
						rows={[]}
						page={{
							pageIndex: storage.pageIndex ?? 0,
							pageSize: storage.pageSize ?? 10,
							totalElements: 0,
						}}
						onPageChange={onPageChange}
						onSort={onSort}
						{...storage}
					/>
				);
			}

			act(() => {
				create(<Harness />);
			});

			expect(localStorage.getItem(key)).toBeNull();
		});

		test("keeps the persisted page when async columns reveal the sort field", () => {
			// the whole point, through both layers: a table whose columns resolve asynchronously used to
			// hand the user page 1 of a re-sorted list and write that loss to storage
			const key = "DataTableIntegration";
			localStorage.setItem(
				key,
				JSON.stringify({pageIndex: 2, pageSize: 10, sortField: "price", sortDirection: "desc"}),
			);

			let available: ReadonlyArray<DataTableColumn<Fruit>> = [];

			function Harness() {
				const {onPageChange, onSort, ...storage} = useDataTableStorage(key, {columns: available});
				return (
					<DataTable
						columns={columns}
						rows={rows}
						page={{
							pageIndex: storage.pageIndex ?? 0,
							pageSize: storage.pageSize ?? 10,
							totalElements: 100,
						}}
						onPageChange={onPageChange}
						onSort={onSort}
						{...storage}
					/>
				);
			}

			let renderer: ReactTestRenderer;
			act(() => {
				renderer = create(<Harness />);
			});

			// the sort is hidden while the columns are empty, and the page is where the user left it
			expect(JSON.parse(localStorage.getItem(key)!)).toMatchObject({pageIndex: 2, sortField: "price"});

			// a click the hook refuses while the columns are still empty must not arm anything either -
			// the header is rendered from the table's own columns, so it looks clickable
			const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
			act(() => {
				const header = renderer.root.findAll(node =>
					node.type === TableSortLabel && node.props.children === "Price"
				);
				header[0].props.onClick();
			});
			expect(warn).toHaveBeenCalled();
			expect(JSON.parse(localStorage.getItem(key)!)).toMatchObject({pageIndex: 2, sortField: "price"});

			available = columns;
			act(() => {
				renderer.update(<Harness />);
			});

			expect(JSON.parse(localStorage.getItem(key)!)).toMatchObject({pageIndex: 2, sortField: "price"});
		});

		test("returns to the first page when the user sorts by another field", () => {
			// the reset the table no longer reports: the hook writes it together with the new sort field
			const key = "DataTableSortReset";
			localStorage.setItem(
				key,
				JSON.stringify({pageIndex: 2, pageSize: 10, sortField: "name", sortDirection: "asc"}),
			);

			function Harness() {
				const {onPageChange, onSort, ...storage} = useDataTableStorage(key, {columns});
				return (
					<DataTable
						columns={columns}
						rows={rows}
						page={{
							pageIndex: storage.pageIndex ?? 0,
							pageSize: storage.pageSize ?? 10,
							totalElements: 100,
						}}
						onPageChange={onPageChange}
						onSort={onSort}
						{...storage}
					/>
				);
			}

			let renderer: ReactTestRenderer;
			act(() => {
				renderer = create(<Harness />);
			});
			act(() => {
				const header = renderer.root.findAll(node =>
					node.type === TableSortLabel && node.props.children === "Price"
				);
				header[0].props.onClick();
			});

			expect(JSON.parse(localStorage.getItem(key)!)).toMatchObject({
				pageIndex: 0,
				pageSize: 10,
				sortField: "price",
				sortDirection: "asc",
			});
		});
	});
});
