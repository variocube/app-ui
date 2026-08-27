/**
 * @jest-environment jsdom
 */

import * as React from "react";
import {useRef} from "react";
import {act, create, ReactTestRenderer} from "react-test-renderer";
import {StorageSetter, StorageUpdater, useStorage} from "./useStorage";

// Reset storage between tests
beforeEach(() => {
	localStorage.clear();
	sessionStorage.clear();
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

		test("deletes the entry when the value equals the default value", () => {
			const {set} = renderWithSetter("default-key");

			set({page: 1, size: 25});
			expect(localStorage.getItem("default-key")).not.toBeNull();

			set(previous => ({...previous, page: 0}));
			expect(localStorage.getItem("default-key")).toBeNull();
		});
	});
});
