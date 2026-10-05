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
			// The inline keypad renders its keys into the container. The pop-up keypad is tested separately.
			ReactDOM.render(<CodeField value="" onChange={onChange} keypad="inline" {...props} />, container);
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

	test("renders the label, helper text and action", () => {
		render({
			label: "Code",
			helperText: "Invalid code",
			error: true,
			action: <button type="submit">Continue</button>,
		});
		expect(container.querySelector("label")?.textContent).toContain("Code");
		expect(container.querySelector("label")?.getAttribute("for")).toBe(getInput().id);
		expect(container.textContent).toContain("Invalid code");
		expect(getInput().getAttribute("aria-invalid")).toBe("true");
	});

	test("renders the action inside the field, after the reveal toggle", () => {
		render({action: <button type="submit">Continue</button>});
		const inputRoot = getInput().closest(".MuiInputBase-root")!;
		const buttons = Array.from(inputRoot.querySelectorAll("button"));
		expect(buttons.map(button => button.getAttribute("aria-label") ?? button.textContent))
			.toEqual(["Show code", "Continue"]);
	});

	test("makes the action fill the field up to its border, with square corners on the left", () => {
		// A plain button: jsdom ignores CSS specificity, so it can't tell whether these styles outweigh a MUI Button's
		// own (they do in browsers, thanks to the doubled `&&` selector).
		render({action: <button type="submit">Continue</button>});
		const style = getComputedStyle(getKey("Continue"));
		expect(style.alignSelf).toBe("stretch");
		expect(style.borderRadius).toBe("0 4px 4px 0");
		expect(style.boxShadow).toBe("none");
		expect(getComputedStyle(getInput().closest(".MuiInputBase-root")!).paddingRight).toBe("0px");
	});

	test("keeps the code off the action without the reveal toggle", () => {
		render({action: <button type="submit">Continue</button>, masked: false});
		expect(getComputedStyle(getInput()).paddingRight).toBe("var(--CodeField-padding-x)");
	});

	test("prevents the action from taking the focus", () => {
		render({action: <button type="submit">Continue</button>});
		const event = new MouseEvent("mousedown", {bubbles: true, cancelable: true});
		getKey("Continue").dispatchEvent(event);
		expect(event.defaultPrevented).toBe(true);
	});

	test("applies inputProps and inputRef to the input", () => {
		const inputRef = React.createRef<HTMLInputElement>();
		render({inputProps: {"data-testid": "code-input"}, inputRef});
		expect(getInput().getAttribute("data-testid")).toBe("code-input");
		expect(inputRef.current).toBe(getInput());
	});

	describe("status", () => {
		function getStatus() {
			return container.querySelector("[aria-live=polite]")!;
		}

		test("shows the status over the input, which it hides", () => {
			render({value: "12", status: "Checking code…"});
			expect(getStatus().textContent).toBe("Checking code…");
			expect(getInput().style.opacity).toBe("0");
		});

		test("does not cover the reveal toggle and the action", () => {
			render({status: "Invalid code", action: <button type="submit">Continue</button>});
			expect(getStatus().contains(getToggle())).toBe(false);
			expect(getStatus().contains(getKey("Continue"))).toBe(false);
		});

		test("shows the status in the error color with error", () => {
			render({status: "Invalid code", error: true});
			const statusColor = getComputedStyle(getStatus()).color;
			render({status: "Checking code…"});
			expect(getComputedStyle(getStatus()).color).not.toBe(statusColor);
		});

		test("shrinks the label, so that it doesn't sit over the status", () => {
			render({label: "Code", status: "Invalid code"});
			expect(container.querySelector("label")?.getAttribute("data-shrink")).toBe("true");
			render({label: "Code"});
			expect(container.querySelector("label")?.getAttribute("data-shrink")).toBe("false");
		});

		test("describes the input with the status and the helper text", () => {
			render({status: "Invalid code", helperText: "Hint", id: "code"});
			const describedBy = getInput().getAttribute("aria-describedby")!.split(" ");
			expect(describedBy).toEqual(["code-status", "code-helper-text"]);
			expect(document.getElementById("code-status")?.textContent).toBe("Invalid code");
			expect(document.getElementById("code-helper-text")?.textContent).toBe("Hint");

			render({helperText: "Hint", id: "code"});
			expect(getInput().getAttribute("aria-describedby")).toBe("code-helper-text");
		});

		test("renders an empty live region without status, so that a status that appears is announced", () => {
			render();
			expect(getStatus()).not.toBeNull();
			expect(getStatus().textContent).toBe("");
			expect(getInput().style.opacity).toBe("");
		});
	});

	describe("size", () => {
		test("enlarges the field's text with large", () => {
			render();
			const root = () => getInput().closest(".MuiInputBase-root")!;
			const mediumSize = getComputedStyle(root()).fontSize;
			render({size: "large"});
			expect(getComputedStyle(root()).fontSize).toBe("1.5rem");
			expect(mediumSize).not.toBe("1.5rem");
		});

		test("keeps the keys' size", () => {
			render({size: "large"});
			expect(getComputedStyle(getKey("1")).minHeight).toBe("64px");
		});
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

	describe("popup keypad", () => {
		function renderPopup(props: Partial<CodeFieldProps> = {}) {
			// no `keypad`, so that the default is tested
			render({keypad: undefined, ...props});
		}

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

		function focus() {
			act(() => getInput().focus());
		}

		function keyDown(key: string) {
			act(() => {
				Simulate.keyDown(getInput(), {key});
			});
		}

		test("shows no keypad until the field has the focus", () => {
			renderPopup();
			expect(getKeypad()).toBeNull();

			focus();
			expect(getKeypad()).not.toBeNull();
			expect(container.contains(getKeypad())).toBe(false);
			expect(getInput().getAttribute("aria-controls")).toBe(getKeypad()!.id);
		});

		test("opens with autoFocus", () => {
			renderPopup({autoFocus: true});
			expect(document.activeElement).toBe(getInput());
			expect(getKeypad()).not.toBeNull();
		});

		test("types into the field and stays open", () => {
			renderPopup({value: "1"});
			focus();
			click(getPopupKey("2"));
			expect(onChange).toHaveBeenCalledWith("12");
			expect(getKeypad()).not.toBeNull();
			expect(document.activeElement).toBe(getInput());
		});

		test("prevents a tap between the keys from taking the focus", () => {
			renderPopup();
			focus();
			const event = new MouseEvent("mousedown", {bubbles: true, cancelable: true});
			getKeypad()!.parentElement!.dispatchEvent(event);
			expect(event.defaultPrevented).toBe(true);
		});

		test("closes when the field loses the focus", () => {
			renderPopup();
			focus();
			act(() => getInput().blur());
			expect(getKeypad()).toBeNull();
		});

		test("closes on Escape without closing an enclosing dialog", () => {
			const onParentKeyDown = jest.fn();
			act(() => {
				ReactDOM.render(
					<div onKeyDown={onParentKeyDown}>
						<CodeField value="" onChange={onChange} />
					</div>,
					container,
				);
			});
			focus();
			keyDown("Escape");
			expect(getKeypad()).toBeNull();
			expect(onParentKeyDown).not.toHaveBeenCalled();

			keyDown("Escape");
			expect(onParentKeyDown).toHaveBeenCalledTimes(1);
		});

		test("stays open on Enter and submit, for the next attempt should the check fail", () => {
			renderPopup({value: "12", onSubmit: jest.fn()});
			focus();
			keyDown("Enter");
			act(() => {
				Simulate.submit(container.querySelector("form")!);
			});
			expect(getKeypad()).not.toBeNull();
		});

		test("does not open when the field can't take the focus, e.g. while hidden", () => {
			const focusSpy = jest.spyOn(HTMLInputElement.prototype, "focus").mockImplementation(() => {});
			try {
				renderPopup({autoFocus: true});
				expect(document.activeElement).not.toBe(getInput());
				expect(getKeypad()).toBeNull();
			}
			finally {
				focusSpy.mockRestore();
			}
		});

		test("opens again on a tap into the focused field", () => {
			renderPopup();
			focus();
			keyDown("Escape");
			click(getInput());
			expect(getKeypad()).not.toBeNull();
		});

		test("does not open again on a tap on the reveal toggle or the action", () => {
			renderPopup({value: "1", action: <button type="submit">Continue</button>});
			focus();
			keyDown("Escape");
			click(getToggle()!);
			click(getKey("Continue"));
			expect(getKeypad()).toBeNull();
		});

		test("closes when disabled", () => {
			renderPopup();
			focus();
			renderPopup({disabled: true});
			expect(getKeypad()).toBeNull();
		});

		test("opens again when the field gets the focus back after being disabled", () => {
			renderPopup();
			focus();
			renderPopup({disabled: true});
			// jsdom keeps the focus on the disabled input, like some browsers, so no focus event follows
			renderPopup({disabled: false});
			expect(document.activeElement).toBe(getInput());
			expect(getKeypad()).not.toBeNull();
		});

		test("does not open on a tap while disabled, not even once enabled again", () => {
			renderPopup({disabled: true, value: "12"});
			// the disabled toggle lets taps through to the field
			click(getToggle()!.parentElement!);
			click(getInput());
			renderPopup({disabled: false, value: "12"});
			expect(getKeypad()).toBeNull();
		});

		test("does not render the keypad in a tooltip", () => {
			renderPopup();
			focus();
			expect(document.querySelector("[role=tooltip]")).toBeNull();
			expect(getKeypad()!.closest("[role=presentation]")).not.toBeNull();
		});
	});

	describe("inline keypad", () => {
		test("shows the keypad below the field without the focus", () => {
			render({keypad: "inline"});
			const root = container.firstElementChild!;
			expect(root.children).toHaveLength(2);
			expect(root.children[1].getAttribute("role")).toBe("group");
			expect(getComputedStyle(root).flexDirection).toBe("column");
			expect(getInput().hasAttribute("aria-controls")).toBe(false);
		});

		test("keeps the keypad open on Escape and blur", () => {
			render({keypad: "inline"});
			act(() => getInput().focus());
			act(() => {
				Simulate.keyDown(getInput(), {key: "Escape"});
			});
			act(() => getInput().blur());
			expect(container.querySelector("[role=group]")).not.toBeNull();
		});
	});

	test("works as a controlled component", () => {
		function Controlled() {
			const [value, setValue] = useState("");
			return <CodeField value={value} onChange={setValue} masked={false} keypad="inline" />;
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
