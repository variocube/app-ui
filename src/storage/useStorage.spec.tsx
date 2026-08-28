/**
 * @jest-environment jsdom
 */

import * as React from "react";
import {useRef} from "react";
import {act, create, ReactTestRenderer} from "react-test-renderer";
import {StorageType} from "./types";
import {StorageSetter, StorageUpdater, useStorage} from "./useStorage";

// Reset storage between tests
beforeEach(() => {
	localStorage.clear();
	sessionStorage.clear();
});

afterEach(() => {
	jest.restoreAllMocks();
});

interface TestResult<T> {
	value: T;
	renderCount: number;
}

function TestComponent({storageKey}: { storageKey: string }) {
	const renderCount = useRef(0);
	renderCount.current++;

	// Inline object literal: new reference every render (the bug trigger)
	const [value] = useStorage(storageKey, {page: 0, size: 25});

	return (
		<div
			data-render-count={renderCount.current}
			data-value={JSON.stringify(value)}
		/>
	);
}

function getTestResult<T>(renderer: ReactTestRenderer): TestResult<T> {
	const div = renderer.root.findByType("div");
	return {
		renderCount: Number(div.props["data-render-count"]),
		value: JSON.parse(div.props["data-value"]),
	};
}

describe("useStorage", () => {
	test("does not cause infinite re-renders with unstable object defaultValue", () => {
		let renderer: ReactTestRenderer;
		act(() => {
			renderer = create(<TestComponent storageKey="test-key" />);
		});

		const afterMount = getTestResult(renderer!);

		// Force a re-render with the same props (simulates parent re-render)
		act(() => {
			renderer.update(<TestComponent storageKey="test-key" />);
		});

		const afterUpdate = getTestResult(renderer!);

		// Render count should stay small, not grow unboundedly
		expect(afterUpdate.renderCount).toBeLessThanOrEqual(3);
		expect(afterUpdate.value).toEqual({page: 0, size: 25});
	});

	test("returns default value when no stored value exists", () => {
		let renderer: ReactTestRenderer;
		act(() => {
			renderer = create(<TestComponent storageKey="missing-key" />);
		});

		const result = getTestResult(renderer!);
		expect(result.value).toEqual({page: 0, size: 25});
	});

	test("returns stored value when it exists", () => {
		localStorage.setItem("stored-key", JSON.stringify({page: 2, size: 50}));

		let renderer: ReactTestRenderer;
		act(() => {
			renderer = create(<TestComponent storageKey="stored-key" />);
		});

		const result = getTestResult(renderer!);
		expect(result.value).toEqual({page: 2, size: 50});
	});

	test("does not loop with a default value that changes on every render", () => {
		// e.g. a default containing a timestamp or a generated id, with nothing persisted yet
		let renderCount = 0;
		function Component() {
			renderCount++;
			const [value] = useStorage("unstable-default-key", {createdAt: `render-${renderCount}`});
			return <div data-value={JSON.stringify(value)} />;
		}

		let renderer: ReactTestRenderer;
		act(() => {
			renderer = create(<Component />);
		});
		// a re-render from the parent is what starts the loop: the state then holds the serialized
		// default of the previous render, and syncing it in turn triggers the next render
		act(() => {
			renderer.update(<Component />);
		});

		expect(renderCount).toBeLessThanOrEqual(4);
	});

	test("serves a changed default value while nothing is persisted", () => {
		// e.g. useDataTableColumnStorage, whose default columns are derived from available columns that
		// an async permission fetch extends - the new default must not be shadowed by the state
		function Component({defaultValue}: { defaultValue: string[] }) {
			const [value] = useStorage("changing-default-key", defaultValue);
			return <div data-value={JSON.stringify(value)} />;
		}

		let renderer: ReactTestRenderer;
		act(() => {
			renderer = create(<Component defaultValue={["name"]} />);
		});
		expect(JSON.parse(renderer!.root.findByType("div").props["data-value"])).toEqual(["name"]);

		act(() => {
			renderer.update(<Component defaultValue={["name", "price"]} />);
		});

		expect(JSON.parse(renderer!.root.findByType("div").props["data-value"])).toEqual(["name", "price"]);
	});

	test("keeps serving the persisted value when the default value changes", () => {
		localStorage.setItem("persisted-key", JSON.stringify(["taste"]));

		function Component({defaultValue}: { defaultValue: string[] }) {
			const [value] = useStorage("persisted-key", defaultValue);
			return <div data-value={JSON.stringify(value)} />;
		}

		let renderer: ReactTestRenderer;
		act(() => {
			renderer = create(<Component defaultValue={["name"]} />);
		});
		act(() => {
			renderer.update(<Component defaultValue={["name", "price"]} />);
		});

		expect(JSON.parse(renderer!.root.findByType("div").props["data-value"])).toEqual(["taste"]);
	});

	test("reads the other area after the storage type changed", () => {
		localStorage.setItem("area-key", JSON.stringify({page: 1, size: 25}));
		sessionStorage.setItem("area-key", JSON.stringify({page: 7, size: 25}));

		function Component({storageType}: { storageType: StorageType }) {
			const [value] = useStorage("area-key", {page: 0, size: 25}, storageType);
			return <div data-value={JSON.stringify(value)} />;
		}

		let renderer: ReactTestRenderer;
		act(() => {
			renderer = create(<Component storageType="local" />);
		});
		expect(JSON.parse(renderer!.root.findByType("div").props["data-value"])).toEqual({page: 1, size: 25});

		// e.g. a "don't remember my settings on this device" toggle
		act(() => {
			renderer.update(<Component storageType="session" />);
		});

		expect(JSON.parse(renderer!.root.findByType("div").props["data-value"])).toEqual({page: 7, size: 25});
	});

	test("reads the value of a new key after the key changed", () => {
		localStorage.setItem("key-a", JSON.stringify({page: 1, size: 25}));
		localStorage.setItem("key-b", JSON.stringify({page: 9, size: 50}));

		let renderer: ReactTestRenderer;
		act(() => {
			renderer = create(<TestComponent storageKey="key-a" />);
		});
		expect(getTestResult(renderer!).value).toEqual({page: 1, size: 25});

		act(() => {
			renderer.update(<TestComponent storageKey="key-b" />);
		});

		expect(getTestResult(renderer!).value).toEqual({page: 9, size: 50});
	});

	describe("setValue", () => {
		interface TestValue {
			page: number;
			size: number;
		}

		function renderWithSetter(storageKey: string) {
			const setters: Array<StorageSetter<TestValue>> = [];
			const values: TestValue[] = [];

			function Component() {
				const [value, setValue] = useStorage<TestValue>(storageKey, {page: 0, size: 25});
				values.push(value);
				setters.push(setValue);
				return null;
			}

			act(() => {
				create(<Component />);
			});

			return {
				values,
				setters,
				set: (value: TestValue | StorageUpdater<TestValue>) =>
					act(() => setters[setters.length - 1](value)),
				last: () => values[values.length - 1],
			};
		}

		test("writes a plain value", () => {
			const {set, last} = renderWithSetter("plain-key");

			set({page: 1, size: 25});

			expect(last()).toEqual({page: 1, size: 25});
			expect(JSON.parse(localStorage.getItem("plain-key")!)).toEqual({page: 1, size: 25});
		});

		test("applies an updater to the current value", () => {
			const {set, last} = renderWithSetter("updater-key");

			set(previous => ({...previous, page: previous.page + 1}));

			expect(last()).toEqual({page: 1, size: 25});
		});

		test("applies an updater to the persisted value, not to a stale closure", () => {
			const {setters, set, last} = renderWithSetter("stale-key");

			// a writer that captured the setter of the initial render
			const staleSetter = setters[0];

			set({page: 5, size: 25});
			act(() => staleSetter(previous => ({...previous, size: 50})));

			// the page written in between is preserved
			expect(last()).toEqual({page: 5, size: 50});
		});

		test("persists a value that equals the default value", () => {
			const {set} = renderWithSetter("default-key");

			set({page: 1, size: 25});
			expect(localStorage.getItem("default-key")).not.toBeNull();

			// deleting the entry instead would make "chose exactly the default" indistinguishable from
			// "never chose anything"
			set(previous => ({...previous, page: 0}));
			expect(JSON.parse(localStorage.getItem("default-key")!)).toEqual({page: 0, size: 25});
		});

		test("does not let a changed default value overrule a choice that equals the old one", () => {
			function Component({defaultValue}: { defaultValue: string[] }) {
				const [value, setValue] = useStorage("chosen-key", defaultValue);
				setters.push(setValue as StorageSetter<string[]>);
				rendered.push(value);
				return null;
			}

			const setters: Array<StorageSetter<string[]>> = [];
			const rendered: string[][] = [];

			let renderer: ReactTestRenderer;
			act(() => {
				renderer = create(<Component defaultValue={["name"]} />);
			});

			// the user picks exactly what the default happens to be
			act(() => setters[setters.length - 1](["name"]));

			act(() => {
				renderer.update(<Component defaultValue={["name", "price"]} />);
			});

			expect(rendered[rendered.length - 1]).toEqual(["name"]);
		});
	});
});
