import * as React from "react";
import {act, create, ReactTestRenderer} from "react-test-renderer";
import {Duration, Now} from "../temporal";
import {DurationFormat} from "./DurationFormat";

describe("DurationFormat", () => {
	test("render de-AT", () => {
		let element: ReactTestRenderer;
		act(() => {
			element = create(<DurationFormat value={Duration.from({days: 5, hours: 2, seconds: 2})} locale="de-AT" />);
		});
		const value = element!.root.children[0];
		expect(value).toBe("5d 02:00:02");
	});

	test("render en-US", () => {
		let element: ReactTestRenderer;
		act(() => {
			element = create(<DurationFormat value={Duration.from({days: 5, hours: 2, seconds: 2})} locale="en-US" />);
		});
		const value = element!.root.children[0];
		expect(value).toBe("5d 02:00:02");
	});

	test("balance seconds de-AT", () => {
		let element: ReactTestRenderer;
		act(() => {
			const duration = Now.instant().until(Now.instant().add({seconds: 10000}))
				.round({largestUnit: "hours"});
			element = create(<DurationFormat value={duration} locale="de-AT" />);
		});
		const value = element!.root.children[0];
		expect(value).toBe("02:46:40");
	});

	test("balance days de-AT", () => {
		let element: ReactTestRenderer;
		act(() => {
			const duration = Now.instant().until(Now.instant().add({hours: 5 * 24}))
				.round({largestUnit: "days"});
			element = create(<DurationFormat value={duration} locale="de-AT" />);
		});
		const value = element!.root.children[0];
		expect(value).toBe("5d");
	});

	test("complex de-AT", () => {
		let element: ReactTestRenderer;
		act(() => {
			const duration = Duration.from({years: 3, months: 4, weeks: 1, days: 6});
			element = create(<DurationFormat value={duration} locale="de-AT" />);
		});
		const value = element!.root.children[0];
		expect(value).toBe("3y 4m 1w 6d");
	});
});
