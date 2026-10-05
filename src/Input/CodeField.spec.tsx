/**
 * @jest-environment jsdom
 */

import * as React from "react";
import {useState} from "react";
import * as ReactDOM from "react-dom";
import {act, Simulate} from "react-dom/test-utils";
import {CodeField, CodeFieldProps} from "./CodeField";

describe("CodeField", () => {
	let container: HTMLDivElement;
	let onChange: jest.Mock;

	beforeEach(() => {
		container = document.createElement("div");
		document.body.appendChild(container);
		onChange = jest.fn();
	});

	afterEach(() => {
		act(() => {
			ReactDOM.unmountComponentAtNode(container);
		});
		container.remove();
	});

	function render(props: Partial<CodeFieldProps> = {}) {
		act(() => {
			ReactDOM.render(<CodeField value="" onChange={onChange} {...props} />, container);
		});
	}

	function getInput() {
		const input = container.querySelector("input");
		if (!input) {
			throw new Error("input not found");
		}
		return input;
	}

	function getKey(label: string) {
		const key = Array.from(container.querySelectorAll("button")).find(button => button.textContent == label);
		if (!key) {
			throw new Error(`key ${label} not found`);
		}
		return key;
	}

	function getToggle() {
		return container.querySelector<HTMLButtonElement>("button[aria-label]");
	}

	function click(element: HTMLElement) {
		act(() => {
			Simulate.click(element);
		});
	}

	test("renders the keys 1-9, Clear, 0, Delete in this order", () => {
		render();
		const keys = Array.from(container.querySelectorAll("button"))
			.filter(button => !button.hasAttribute("aria-label"))
			.map(button => button.textContent);
		expect(keys).toEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9", "Clear", "0", "Delete"]);
	});

	test("appends the tapped digit", () => {
		render({value: "12"});
		click(getKey("3"));
		click(getKey("0"));
		expect(onChange.mock.calls).toEqual([["123"], ["120"]]);
	});

	test("Delete removes the last character, Clear removes all", () => {
		render({value: "123"});
		click(getKey("Delete"));
		click(getKey("Clear"));
		expect(onChange.mock.calls).toEqual([["12"], [""]]);
	});

	test("disables Clear and Delete when the value is empty", () => {
		render();
		expect(getKey("Clear").disabled).toBe(true);
		expect(getKey("Delete").disabled).toBe(true);
		expect(getKey("1").disabled).toBe(false);
	});

	test("disables the digit keys for a value longer than maxLength", () => {
		render({value: "123456", maxLength: 4});
		expect(getKey("5").disabled).toBe(true);
		click(getKey("Delete"));
		expect(onChange).toHaveBeenCalledWith("12345");
	});

	test("takes maxLength from inputProps", () => {
		render({value: "12", inputProps: {maxLength: 2, "data-testid": "code-input"}});
		expect(getInput().maxLength).toBe(2);
		expect(getKey("3").disabled).toBe(true);
	});

	test("prefers the maxLength prop over inputProps", () => {
		render({value: "12", maxLength: 3, inputProps: {maxLength: 2}});
		expect(getInput().maxLength).toBe(3);
		expect(getKey("3").disabled).toBe(false);
	});

	test("keys don't submit an enclosing form", () => {
		render();
		const keys = Array.from(container.querySelectorAll("button")).filter(button =>
			!button.hasAttribute("aria-label")
		);
		expect(keys.every(key => key.type == "button")).toBe(true);
	});

	test("disables the digit keys once maxLength is reached", () => {
		render({value: "1234", maxLength: 4});
		expect(getKey("5").disabled).toBe(true);
		expect(getKey("0").disabled).toBe(true);
		expect(getKey("Delete").disabled).toBe(false);
		expect(getInput().maxLength).toBe(4);
	});

	test("disables the field, the keys and the toggle", () => {
		render({value: "12", disabled: true});
		expect(getInput().disabled).toBe(true);
		expect(Array.from(container.querySelectorAll("button")).every(button => button.disabled)).toBe(true);
	});

	test("passes typed input through", () => {
		render();
		act(() => {
			Simulate.change(getInput(), {target: {value: "A-42"}} as any);
		});
		expect(onChange).toHaveBeenCalledWith("A-42");
	});

	test("keeps the keys out of the tab order and prevents them from taking the focus", () => {
		render();
		const key = getKey("1");
		expect(key.tabIndex).toBe(-1);
		const event = new MouseEvent("mousedown", {bubbles: true, cancelable: true});
		key.dispatchEvent(event);
		expect(event.defaultPrevented).toBe(true);
	});

	test("focuses the field after a key tap", () => {
		render();
		click(getKey("1"));
		expect(document.activeElement).toBe(getInput());
	});

	test("does not open the soft keyboard by default", () => {
		render();
		expect(getInput().getAttribute("inputmode")).toBe("none");
	});

	test("does not move the focus on a key tap when the soft keyboard is enabled", () => {
		render({softKeyboard: true});
		expect(getInput().hasAttribute("inputmode")).toBe(false);
		click(getKey("1"));
		expect(document.activeElement).not.toBe(getInput());
	});

	test("masks the code by default and reveals it with the toggle", () => {
		render({value: "12"});
		expect(getInput().type).toBe("password");
		expect(getToggle()?.getAttribute("aria-label")).toBe("Show code");

		click(getToggle()!);
		expect(getInput().type).toBe("text");
		expect(getToggle()?.getAttribute("aria-label")).toBe("Hide code");
	});

	test("prevents the toggle from taking the focus", () => {
		render({value: "12"});
		const event = new MouseEvent("mousedown", {bubbles: true, cancelable: true});
		getToggle()!.dispatchEvent(event);
		expect(event.defaultPrevented).toBe(true);
	});

	test("masks a revealed code again when the value is emptied", () => {
		render({value: "12"});
		click(getToggle()!);
		expect(getInput().type).toBe("text");

		render({value: ""});
		render({value: "3"});
		expect(getInput().type).toBe("password");
	});

	test("renders no toggle when not revealable or not masked", () => {
		render({revealable: false});
		expect(getInput().type).toBe("password");
		expect(getToggle()).toBeNull();

		render({masked: false});
		expect(getInput().type).toBe("text");
		expect(getToggle()).toBeNull();
	});

	test("uses the given labels", () => {
		const labels = {
			clear: "Löschen",
			delete: "Entfernen",
			showCode: "Code zeigen",
			hideCode: "Code verbergen",
			keypad: "Tastenfeld",
		};
		render({value: "1", labels: key => labels[key]});
		expect(getKey("Löschen")).toBeTruthy();
		expect(getKey("Entfernen")).toBeTruthy();
		expect(getToggle()?.getAttribute("aria-label")).toBe("Code zeigen");
		expect(container.querySelector("[role=group]")?.getAttribute("aria-label")).toBe("Tastenfeld");
	});

	test("labels the keypad as a group", () => {
		render();
		const group = container.querySelector("[role=group]");
		expect(group?.getAttribute("aria-label")).toBe("Keypad");
		expect(group?.contains(getKey("1"))).toBe(true);
	});

	test("renders the label, helper text and actions", () => {
		render({
			label: "Code",
			helperText: "Invalid code",
			error: true,
			actions: <button type="button">Continue</button>,
		});
		expect(container.querySelector("label")?.textContent).toContain("Code");
		expect(container.querySelector("label")?.getAttribute("for")).toBe(getInput().id);
		expect(container.textContent).toContain("Invalid code");
		expect(getInput().getAttribute("aria-invalid")).toBe("true");
		expect(getKey("Continue")).toBeTruthy();
	});

	test("applies inputProps and inputRef to the input", () => {
		const inputRef = React.createRef<HTMLInputElement>();
		render({inputProps: {"data-testid": "code-input"}, inputRef});
		expect(getInput().getAttribute("data-testid")).toBe("code-input");
		expect(inputRef.current).toBe(getInput());
	});

	describe("submit", () => {
		test("renders no form without onSubmit", () => {
			render();
			expect(container.querySelector("form")).toBeNull();
		});

		test("calls onSubmit when the form is submitted", () => {
			const onSubmit = jest.fn();
			render({value: "12", onSubmit});
			const form = container.querySelector("form")!;
			act(() => {
				Simulate.submit(form);
			});
			expect(onSubmit).toHaveBeenCalledTimes(1);
		});

		test("prevents the native submission", () => {
			render({value: "12", onSubmit: jest.fn()});
			const event = new Event("submit", {bubbles: true, cancelable: true});
			act(() => {
				container.querySelector("form")!.dispatchEvent(event);
			});
			expect(event.defaultPrevented).toBe(true);
		});

		test("does not call onSubmit while disabled", () => {
			const onSubmit = jest.fn();
			render({value: "12", onSubmit, disabled: true});
			act(() => {
				Simulate.submit(container.querySelector("form")!);
			});
			expect(onSubmit).not.toHaveBeenCalled();
		});
	});

	describe("autoFocus", () => {
		test("focuses the field on mount", () => {
			render({autoFocus: true});
			expect(document.activeElement).toBe(getInput());
		});

		test("focuses the field again when it becomes enabled", () => {
			render({autoFocus: true, disabled: true});
			expect(document.activeElement).not.toBe(getInput());

			render({autoFocus: true, disabled: false});
			expect(document.activeElement).toBe(getInput());
		});

		// Browsers blur a focused input when it is disabled, jsdom keeps the focus on it. The tests therefore
		// dispatch the blur themselves and check that the field calls `focus()` when it is enabled again.
		function blurDisabled() {
			act(() => {
				getInput().dispatchEvent(new FocusEvent("focusout", {bubbles: true}));
			});
		}

		test("gives the focus back after being disabled when the field had it", () => {
			render();
			act(() => getInput().focus());
			render({disabled: true});
			blurDisabled();
			const focus = jest.spyOn(getInput(), "focus");

			render({disabled: false});
			expect(focus).toHaveBeenCalled();
		});

		test("does not take the focus back when the field lost it before being disabled", () => {
			render();
			act(() => getInput().focus());
			act(() => getInput().blur());
			render({disabled: true});
			const focus = jest.spyOn(getInput(), "focus");

			render({disabled: false});
			expect(focus).not.toHaveBeenCalled();
		});

		test("does not take the focus back from another control", () => {
			const other = document.createElement("button");
			document.body.appendChild(other);
			render();
			act(() => getInput().focus());
			render({disabled: true});
			act(() => other.focus());

			render({disabled: false});
			expect(document.activeElement).toBe(other);
			other.remove();
		});

		test("does not take the focus when the field didn't have it", () => {
			render();
			render({disabled: true});
			render({disabled: false});
			expect(document.activeElement).not.toBe(getInput());
		});

		test("does not focus the field without autoFocus", () => {
			render();
			expect(document.activeElement).not.toBe(getInput());
		});
	});

	describe("layout", () => {
		let width: number;
		let observers: { callback: ResizeObserverCallback; disconnect: jest.Mock }[];
		let frames: Map<number, FrameRequestCallback>;
		let nextFrame: number;

		beforeEach(() => {
			width = 800;
			observers = [];
			frames = new Map();
			nextFrame = 1;
			jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(() => ({width} as DOMRect));
			(window as any).ResizeObserver = class {
				disconnect = jest.fn();
				constructor(callback: ResizeObserverCallback) {
					observers.push({callback, disconnect: this.disconnect});
				}
				observe() {}
			};
			jest.spyOn(window, "requestAnimationFrame").mockImplementation(callback => {
				frames.set(nextFrame, callback);
				return nextFrame++;
			});
			jest.spyOn(window, "cancelAnimationFrame").mockImplementation(id => frames.delete(id));
		});

		afterEach(() => {
			jest.restoreAllMocks();
			delete (window as any).ResizeObserver;
		});

		function getAreas() {
			return getComputedStyle(container.firstElementChild!).gridTemplateAreas;
		}

		function resize(newWidth: number) {
			width = newWidth;
			act(() => observers.forEach(observer => observer.callback([], {} as ResizeObserver)));
		}

		function runFrames() {
			act(() => {
				const callbacks = Array.from(frames.values());
				frames.clear();
				callbacks.forEach(callback => callback(0));
			});
		}

		test("puts the keypad next to the field and the actions below the field in a wide container", () => {
			render({actions: <button type="submit">Continue</button>});
			expect(getAreas()).toBe(`"field keypad" "actions keypad"`);
		});

		test("puts the keypad below the field and the actions below the keypad in a narrow container", () => {
			width = 400;
			render({actions: <button type="submit">Continue</button>});
			expect(getAreas()).toBe(`"field" "keypad" "actions"`);
		});

		test("has no actions area without actions", () => {
			render();
			expect(getAreas()).toBe(`"field keypad"`);
		});

		test("switches the layout a frame after a resize", () => {
			render();
			resize(400);
			expect(getAreas()).toBe(`"field keypad"`);

			runFrames();
			expect(getAreas()).toBe(`"field" "keypad"`);

			resize(800);
			runFrames();
			expect(getAreas()).toBe(`"field keypad"`);
		});

		test("disconnects the observer and cancels a pending frame on unmount", () => {
			render();
			resize(400);
			expect(frames.size).toBe(1);

			act(() => {
				ReactDOM.unmountComponentAtNode(container);
			});
			expect(observers[0].disconnect).toHaveBeenCalled();
			expect(frames.size).toBe(0);
		});
	});

	describe("popup keypad", () => {
		function getKeypad() {
			return document.querySelector<HTMLElement>("[role=group]");
		}

		function getPopupKey(label: string) {
			const key = Array.from(getKeypad()?.querySelectorAll("button") ?? []).find(button =>
				button.textContent == label
			);
			if (!key) {
				throw new Error(`key ${label} not found`);
			}
			return key;
		}

		function open() {
			act(() => getInput().focus());
			click(getInput());
		}

		function keyDown(key: string) {
			act(() => {
				Simulate.keyDown(getInput(), {key});
			});
		}

		test("shows no keypad until the field is tapped", () => {
			render({keypad: "popup"});
			expect(getKeypad()).toBeNull();

			open();
			expect(getKeypad()).not.toBeNull();
			expect(container.contains(getKeypad())).toBe(false);
			expect(getInput().getAttribute("aria-controls")).toBe(getKeypad()!.id);
		});

		test("does not open on focus alone", () => {
			render({keypad: "popup", autoFocus: true});
			expect(document.activeElement).toBe(getInput());
			expect(getKeypad()).toBeNull();
			expect(getInput().hasAttribute("aria-controls")).toBe(false);
		});

		test("does not open on a tap on the reveal toggle", () => {
			render({keypad: "popup", value: "1"});
			click(getToggle()!);
			expect(getKeypad()).toBeNull();
		});

		test("types into the field and stays open", () => {
			render({keypad: "popup", value: "1"});
			open();
			click(getPopupKey("2"));
			expect(onChange).toHaveBeenCalledWith("12");
			expect(getKeypad()).not.toBeNull();
			expect(document.activeElement).toBe(getInput());
		});

		test("prevents a tap between the keys from taking the focus", () => {
			render({keypad: "popup"});
			open();
			const event = new MouseEvent("mousedown", {bubbles: true, cancelable: true});
			getKeypad()!.parentElement!.dispatchEvent(event);
			expect(event.defaultPrevented).toBe(true);
		});

		test("closes when the field loses the focus", () => {
			render({keypad: "popup"});
			open();
			act(() => getInput().blur());
			expect(getKeypad()).toBeNull();
		});

		test("closes on Escape without closing an enclosing dialog", () => {
			const onParentKeyDown = jest.fn();
			act(() => {
				ReactDOM.render(
					<div onKeyDown={onParentKeyDown}>
						<CodeField value="" onChange={onChange} keypad="popup" />
					</div>,
					container,
				);
			});
			open();
			keyDown("Escape");
			expect(getKeypad()).toBeNull();
			expect(onParentKeyDown).not.toHaveBeenCalled();

			keyDown("Escape");
			expect(onParentKeyDown).toHaveBeenCalledTimes(1);
		});

		test("closes on Enter", () => {
			render({keypad: "popup"});
			open();
			keyDown("Enter");
			expect(getKeypad()).toBeNull();
		});

		test("closes when disabled and stays closed when enabled again", () => {
			render({keypad: "popup"});
			open();
			render({keypad: "popup", disabled: true});
			expect(getKeypad()).toBeNull();

			render({keypad: "popup", disabled: false});
			expect(getKeypad()).toBeNull();
		});

		test("does not render the keypad in a tooltip", () => {
			render({keypad: "popup"});
			open();
			expect(document.querySelector("[role=tooltip]")).toBeNull();
			expect(getKeypad()!.closest("[role=presentation]")).not.toBeNull();
		});

		test("focuses the field when the keypad opens", () => {
			render({keypad: "popup"});
			click(getInput());
			expect(getKeypad()).not.toBeNull();
			expect(document.activeElement).toBe(getInput());
		});

		test("does not open on a tap while disabled, not even once enabled again", () => {
			render({keypad: "popup", disabled: true, value: "12"});
			// the disabled toggle lets taps through to the field
			click(getToggle()!.parentElement!);
			click(getInput());
			render({keypad: "popup", disabled: false, value: "12"});
			expect(getKeypad()).toBeNull();
		});

		test("renders the actions next to the field", () => {
			render({keypad: "popup", actions: <button type="submit">Continue</button>});
			const root = container.firstElementChild!;
			expect(getComputedStyle(root).display).toBe("flex");
			expect(root.children).toHaveLength(2);
			expect(root.children[1].textContent).toBe("Continue");
		});
	});

	test("works as a controlled component", () => {
		function Controlled() {
			const [value, setValue] = useState("");
			return <CodeField value={value} onChange={setValue} masked={false} />;
		}
		act(() => {
			ReactDOM.render(<Controlled />, container);
		});
		click(getKey("4"));
		click(getKey("2"));
		click(getKey("7"));
		click(getKey("Delete"));
		expect(getInput().value).toBe("42");
	});
});
