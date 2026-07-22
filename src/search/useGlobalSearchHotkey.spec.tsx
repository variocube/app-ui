/**
 * @jest-environment jsdom
 */

import * as React from "react";
import {act, create, ReactTestRenderer} from "react-test-renderer";
import {useGlobalSearchHotkey} from "./useGlobalSearchHotkey";

function TestComponent({onOpen}: { onOpen: () => void }) {
	useGlobalSearchHotkey(onOpen);
	return null;
}

function dispatchKeyDown(init: KeyboardEventInit) {
	const event = new KeyboardEvent("keydown", {cancelable: true, ...init});
	act(() => {
		window.dispatchEvent(event);
	});
	return event;
}

describe("useGlobalSearchHotkey", () => {
	let renderer: ReactTestRenderer;
	let onOpen: jest.Mock;

	beforeEach(() => {
		onOpen = jest.fn();
		act(() => {
			renderer = create(<TestComponent onOpen={onOpen} />);
		});
	});

	afterEach(() => {
		act(() => {
			renderer.unmount();
		});
	});

	test("Ctrl+K opens and prevents default", () => {
		const event = dispatchKeyDown({key: "k", ctrlKey: true});
		expect(onOpen).toHaveBeenCalledTimes(1);
		expect(event.defaultPrevented).toBe(true);
	});

	test("Cmd+K opens", () => {
		dispatchKeyDown({key: "k", metaKey: true});
		expect(onOpen).toHaveBeenCalledTimes(1);
	});

	test("Ctrl+Shift+K (uppercase key) opens", () => {
		dispatchKeyDown({key: "K", ctrlKey: true, shiftKey: true});
		expect(onOpen).toHaveBeenCalledTimes(1);
	});

	test("plain K does not open", () => {
		const event = dispatchKeyDown({key: "k"});
		expect(onOpen).not.toHaveBeenCalled();
		expect(event.defaultPrevented).toBe(false);
	});

	test("Ctrl with another key does not open", () => {
		dispatchKeyDown({key: "j", ctrlKey: true});
		expect(onOpen).not.toHaveBeenCalled();
	});

	test("listener is removed on unmount", () => {
		act(() => {
			renderer.unmount();
		});
		dispatchKeyDown({key: "k", ctrlKey: true});
		expect(onOpen).not.toHaveBeenCalled();
	});
});
