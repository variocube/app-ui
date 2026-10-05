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
		return container.querySelector<HTMLButtonElement>("button[aria-pressed]");
	}

	function click(element: HTMLElement) {
		act(() => {
			Simulate.click(element);
		});
	}

	test("renders the keys 1-9, Clear, 0, Delete in this order", () => {
		render();
		const keys = Array.from(container.querySelectorAll("button"))
			.filter(button => !button.hasAttribute("aria-pressed"))
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
		expect(getToggle()?.getAttribute("aria-pressed")).toBe("true");
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
		const labels = {clear: "Löschen", delete: "Entfernen", showCode: "Code zeigen", hideCode: "Code verbergen"};
		render({value: "1", labels: key => labels[key]});
		expect(getKey("Löschen")).toBeTruthy();
		expect(getKey("Entfernen")).toBeTruthy();
		expect(getToggle()?.getAttribute("aria-label")).toBe("Code zeigen");
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

		test("does not focus the field without autoFocus", () => {
			render();
			expect(document.activeElement).not.toBe(getInput());
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
