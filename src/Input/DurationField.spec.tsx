import * as React from "react";
import {act, create, ReactTestRenderer} from "react-test-renderer";
import {Duration} from "../temporal";
import {DurationField} from "./DurationField";

function findAmountInputs(rendered: ReactTestRenderer) {
	return rendered.root.findAllByType("input")
		.filter(input => input.props.inputMode === "numeric");
}

describe("DurationField", () => {
	test("renders two empty pairs for a null value", () => {
		let rendered: ReactTestRenderer;
		act(() => {
			rendered = create(
				<DurationField label="Retention" value={null} onChange={() => {}} locale="en-US" />,
			);
		});
		const amounts = findAmountInputs(rendered!);
		expect(amounts.map(input => input.props.value)).toEqual(["", ""]);
		expect(amounts.map(input => input.props["aria-label"])).toEqual(["years", "months"]);
	});

	test("renders the pairs of a value plus a trailing empty pair", () => {
		let rendered: ReactTestRenderer;
		act(() => {
			rendered = create(
				<DurationField
					value={Duration.from({months: 5, days: 10})}
					onChange={() => {}}
					locale="en-US"
				/>,
			);
		});
		const amounts = findAmountInputs(rendered!);
		expect(amounts.map(input => input.props.value)).toEqual(["5", "10", ""]);
		expect(amounts.map(input => input.props["aria-label"])).toEqual(["months", "days", "hours"]);
	});

	test("typing an amount emits the duration", () => {
		const handleChange = jest.fn();
		let rendered: ReactTestRenderer;
		act(() => {
			rendered = create(
				<DurationField value={null} onChange={handleChange} locale="en-US" />,
			);
		});
		act(() => {
			findAmountInputs(rendered!)[0].props.onChange({target: {value: "5"}});
		});
		expect(handleChange).toHaveBeenCalledTimes(1);
		expect(handleChange.mock.calls[0][0]?.toString()).toBe("P5Y");
	});

	test("clearing the amount emits null", () => {
		const handleChange = jest.fn();
		let rendered: ReactTestRenderer;
		act(() => {
			rendered = create(
				<DurationField value={Duration.from({years: 5})} onChange={handleChange} locale="en-US" />,
			);
		});
		act(() => {
			findAmountInputs(rendered!)[0].props.onChange({target: {value: ""}});
		});
		expect(handleChange).toHaveBeenCalledTimes(1);
		expect(handleChange.mock.calls[0][0]).toBeNull();
	});

	test("restricts the units to the units property", () => {
		let rendered: ReactTestRenderer;
		act(() => {
			rendered = create(
				<DurationField
					value={null}
					onChange={() => {}}
					units={["days"]}
					locale="en-US"
				/>,
			);
		});
		const amounts = findAmountInputs(rendered!);
		expect(amounts.map(input => input.props["aria-label"])).toEqual(["days"]);
	});
});
