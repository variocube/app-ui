/**
 * @jest-environment jsdom
 */

import * as React from "react";
import {useRef} from "react";
import {act, create, ReactTestRenderer} from "react-test-renderer";
import {useStorage} from "./useStorage";

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
});
