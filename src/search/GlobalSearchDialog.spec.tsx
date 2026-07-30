/**
 * @jest-environment jsdom
 */

import * as React from "react";
import * as ReactDOM from "react-dom";
import {act, Simulate} from "react-dom/test-utils";
import {GlobalSearchDialog, GlobalSearchDialogProps} from "./GlobalSearchDialog";

interface Result {
	id: string;
	label: string;
}

describe("GlobalSearchDialog", () => {
	let container: HTMLDivElement;
	let search: jest.Mock;
	let onClose: jest.Mock;
	let onSelect: jest.Mock;

	beforeEach(() => {
		jest.useFakeTimers();
		container = document.createElement("div");
		document.body.appendChild(container);
		search = jest.fn().mockResolvedValue([]);
		onClose = jest.fn();
		onSelect = jest.fn();
	});

	afterEach(() => {
		act(() => {
			ReactDOM.unmountComponentAtNode(container);
		});
		container.remove();
		jest.useRealTimers();
	});

	async function render(overrides: Partial<GlobalSearchDialogProps<Result>> = {}) {
		await act(async () => {
			ReactDOM.render(
				<GlobalSearchDialog<Result>
					open
					onClose={onClose}
					search={search}
					onSelect={onSelect}
					getOptionLabel={option => option.label}
					renderOption={(props, option) => <li {...props} key={option.id}>{option.label}</li>}
					title="Search"
					placeholder="Search"
					clearLabel="clear"
					loadingText="searching"
					noOptionsText="no fruits found"
					{...overrides}
				/>,
				container,
			);
		});
	}

	function getInput() {
		const input = document.querySelector("input");
		if (!input) {
			throw new Error("search input not found");
		}
		return input;
	}

	function type(value: string) {
		act(() => {
			Simulate.change(getInput(), {target: {value}} as any);
		});
	}

	/** Advances the fake timers and flushes resulting promise resolutions (react-async-hook state updates). */
	async function advanceTimers(ms: number) {
		await act(async () => {
			jest.advanceTimersByTime(ms);
		});
	}

	/** Flushes pending promise resolutions (react-async-hook state updates). */
	async function flush() {
		await act(async () => {});
	}

	function getOptionTexts() {
		return Array.from(document.querySelectorAll("[role=\"option\"]")).map(option => option.textContent);
	}

	function query(selector: string) {
		return document.querySelector(selector);
	}

	test("does not search before the debounce delay has elapsed", async () => {
		await render();
		type("john");
		expect(search).not.toHaveBeenCalled();
		await advanceTimers(499);
		expect(search).not.toHaveBeenCalled();
		await advanceTimers(1);
		expect(search).toHaveBeenCalledTimes(1);
		expect(search).toHaveBeenCalledWith(["john"]);
	});

	test("does not search below minQueryLength", async () => {
		await render();
		type("j");
		await advanceTimers(1000);
		expect(search).not.toHaveBeenCalled();
	});

	test("honours a custom minQueryLength and debounceMs", async () => {
		await render({minQueryLength: 3, debounceMs: 100});
		type("jo");
		await advanceTimers(1000);
		expect(search).not.toHaveBeenCalled();
		type("joh");
		await advanceTimers(99);
		expect(search).not.toHaveBeenCalled();
		await advanceTimers(1);
		expect(search).toHaveBeenCalledWith(["joh"]);
	});

	test("tokenizes the input on whitespace", async () => {
		await render();
		type("  john   doe ");
		await advanceTimers(500);
		expect(search).toHaveBeenCalledWith(["john", "doe"]);
	});

	test("exposes options only once the settled result matches the current input", async () => {
		let resolveSearch!: (results: Result[]) => void;
		search.mockImplementation(() =>
			new Promise<Result[]>(resolve => {
				resolveSearch = resolve;
			})
		);
		await render();
		type("john");
		await advanceTimers(500);
		expect(search).toHaveBeenCalledWith(["john"]);

		// Request still pending: no options may be offered (a quick Enter must not select anything).
		expect(getOptionTexts()).toEqual([]);

		await act(async () => {
			resolveSearch([{id: "1", label: "John Doe"}]);
		});
		expect(getOptionTexts()).toEqual(["John Doe"]);

		// Typing on invalidates the shown options immediately, even before the debounce commits.
		type("johnny");
		expect(getOptionTexts()).toEqual([]);
	});

	test("shows the loading state and never flashes previous results while a new query is pending", async () => {
		let resolveSecond!: (results: Result[]) => void;
		search
			.mockResolvedValueOnce([{id: "1", label: "Red Apple"}])
			.mockImplementationOnce(() =>
				new Promise<Result[]>(resolve => {
					resolveSecond = resolve;
				})
			);
		const renderedOptions: string[] = [];
		await render({
			renderOption: (props, option) => {
				renderedOptions.push(option.label);
				return <li {...props} key={option.id}>{option.label}</li>;
			},
		});
		type("red");
		await advanceTimers(500);
		expect(getOptionTexts()).toEqual(["Red Apple"]);

		// Replace the query: from the keystroke until the new request settles, the previous query's results
		// must never render again — not even for the render in which the debounce commits the new filter
		// (useAsync still holds the previous result there), and the popup must report loading rather than
		// a premature "no results".
		renderedOptions.length = 0;
		type("fruit");
		expect(document.body.textContent).toContain("searching");
		await advanceTimers(500);
		expect(search).toHaveBeenLastCalledWith(["fruit"]);
		expect(renderedOptions).toEqual([]);
		expect(getOptionTexts()).toEqual([]);
		expect(document.body.textContent).toContain("searching");

		await act(async () => {
			resolveSecond([]);
		});
		expect(renderedOptions).toEqual([]);
		expect(getOptionTexts()).toEqual([]);
		expect(document.body.textContent).toContain("no fruits found");
	});

	test("closes the results popup instead of showing 'no results' when the input drops below minQueryLength", async () => {
		search.mockResolvedValue([{id: "1", label: "Red Apple"}]);
		await render();
		type("red");
		await advanceTimers(500);
		expect(getOptionTexts()).toEqual(["Red Apple"]);

		// The committed filter still says "red" for a whole debounce window after this keystroke; the popup must
		// not stay open with the stale filter's results (or a "no results" text) during it.
		type("r");
		expect(getOptionTexts()).toEqual([]);
		expect(document.body.textContent).not.toContain("no fruits found");
		await advanceTimers(500);
		expect(getOptionTexts()).toEqual([]);
		expect(document.body.textContent).not.toContain("no fruits found");
		expect(search).toHaveBeenCalledTimes(1);
	});

	test("renders a failed search as an error and drops it once the next query starts", async () => {
		search.mockRejectedValueOnce(new Error("boom"));
		await render();
		type("john");
		await advanceTimers(500);
		await flush();
		expect(document.body.textContent).toContain("boom");

		// A new keystroke invalidates the failed query: showing its error next to the spinner of the new,
		// in-flight query would report a failure that no longer applies.
		type("johnny");
		expect(document.body.textContent).not.toContain("boom");
		expect(document.body.textContent).toContain("searching");
	});

	test("resets input, filter and results when the dialog is closed via the open prop", async () => {
		search.mockResolvedValue([{id: "1", label: "John Doe"}]);
		await render();
		type("john");
		await advanceTimers(500);
		expect(getInput().value).toBe("john");
		expect(getOptionTexts()).toEqual(["John Doe"]);

		await render({open: false});
		await render({open: true});
		expect(getInput().value).toBe("");
		expect(getOptionTexts()).toEqual([]);
		expect(search).toHaveBeenCalledTimes(1);
	});

	test("groups options with groupBy", async () => {
		search.mockResolvedValue([
			{id: "1", label: "Red Apple"},
			{id: "2", label: "Carrot"},
		]);
		await render({groupBy: option => option.label === "Carrot" ? "Vegetables" : "Fruits"});
		type("food");
		await advanceTimers(500);
		expect(Array.from(document.querySelectorAll(".MuiAutocomplete-groupLabel")).map(e => e.textContent))
			.toEqual(["Fruits", "Vegetables"]);
	});

	test("selecting an option calls onSelect and closes the dialog", async () => {
		search.mockResolvedValue([{id: "1", label: "John Doe"}]);
		await render();
		type("john");
		await advanceTimers(500);
		const option = document.querySelector("[role=\"option\"]");
		if (!option) {
			throw new Error("option not found");
		}
		act(() => {
			Simulate.click(option);
		});
		await flush();
		expect(onSelect).toHaveBeenCalledWith({id: "1", label: "John Doe"});
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	test("Escape closes the dialog while the results popup is open", async () => {
		search.mockResolvedValue([{id: "1", label: "John Doe"}]);
		await render();
		type("john");
		await advanceTimers(500);
		act(() => {
			Simulate.keyDown(getInput(), {key: "Escape"});
		});
		await flush();
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	test("clear button empties the input and cancels the pending debounce", async () => {
		await render();
		type("john");
		const clearButton = document.querySelector("[aria-label=\"clear\"]");
		if (!clearButton) {
			throw new Error("clear button not found");
		}
		act(() => {
			Simulate.click(clearButton);
		});
		await advanceTimers(1000);
		expect(search).not.toHaveBeenCalled();
		expect(getInput().value).toBe("");
	});

	test("labels the icon buttons in English when no labels are given", async () => {
		await render({clearLabel: undefined});
		type("john");
		expect(query("[aria-label=\"Close\"]")).not.toBeNull();
		expect(query("[aria-label=\"Clear\"]")).not.toBeNull();
	});

	test("names the dialog after its title only", async () => {
		await render();
		const labelledBy = query("[role=\"dialog\"]")?.getAttribute("aria-labelledby");
		expect(labelledBy).toBeTruthy();
		const titleElement = document.getElementById(labelledBy!);
		expect(titleElement?.textContent).toBe("Search");
		// The labelled element must be the title text, not the header around it: the accessible name of the
		// dialog would otherwise absorb the "Back"/"Close" labels of the icon buttons.
		expect(titleElement?.querySelector("button")).toBeNull();
	});

	test("unmounting cancels the pending debounce without a state update warning", async () => {
		const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
		try {
			await render();
			type("john");
			act(() => {
				ReactDOM.unmountComponentAtNode(container);
			});
			await advanceTimers(1000);
			expect(search).not.toHaveBeenCalled();
			expect(consoleError).not.toHaveBeenCalled();
		}
		finally {
			consoleError.mockRestore();
		}
	});
});
