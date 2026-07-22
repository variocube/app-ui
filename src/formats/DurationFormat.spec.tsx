import * as React from "react";
import {act, create, ReactTestRenderer} from "react-test-renderer";
import {Duration, Now} from "../temporal";
import {DurationFormat} from "./DurationFormat";

function renderToString(element: React.ReactElement) {
	let rendered: ReactTestRenderer;
	act(() => {
		rendered = create(element);
	});
	return rendered!.root.children[0];
}

const hasIntlDurationFormat = typeof (Intl as any).DurationFormat === "function";
const describeIntl = hasIntlDurationFormat ? describe : describe.skip;

describe("DurationFormat", () => {
	describeIntl("with Intl.DurationFormat", () => {
		test("render narrow en-US", () => {
			const value = renderToString(
				<DurationFormat value={Duration.from({days: 5, hours: 2, seconds: 2})} locale="en-US" />,
			);
			expect(value).toBe("5d 2h 2s");
		});

		test("render complex narrow en-US", () => {
			const value = renderToString(
				<DurationFormat value={Duration.from({years: 3, months: 4, weeks: 1, days: 6})} locale="en-US" />,
			);
			expect(value).toBe("3y 4m 1w 6d");
		});

		test("render long en-US", () => {
			const value = renderToString(
				<DurationFormat value={Duration.from({years: 7})} style="long" locale="en-US" />,
			);
			expect(value).toBe("7 years");
		});

		test("render long de-AT", () => {
			const value = renderToString(
				<DurationFormat value={Duration.from({years: 3, months: 4})} style="long" locale="de-AT" />,
			);
			expect(value).toBe("3 Jahre, 4 Monate");
		});
	});

	describe("fallback without Intl.DurationFormat", () => {
		let intlDurationFormat: unknown;

		beforeAll(() => {
			intlDurationFormat = (Intl as any).DurationFormat;
			delete (Intl as any).DurationFormat;
		});

		afterAll(() => {
			if (intlDurationFormat) {
				(Intl as any).DurationFormat = intlDurationFormat;
			}
		});

		test("render de-AT", () => {
			const value = renderToString(
				<DurationFormat value={Duration.from({days: 5, hours: 2, seconds: 2})} locale="de-AT" />,
			);
			expect(value).toBe("5d 02:00:02");
		});

		test("render en-US", () => {
			const value = renderToString(
				<DurationFormat value={Duration.from({days: 5, hours: 2, seconds: 2})} locale="en-US" />,
			);
			expect(value).toBe("5d 02:00:02");
		});

		test("balance seconds de-AT", () => {
			const duration = Now.instant().until(Now.instant().add({seconds: 10000}))
				.round({largestUnit: "hours"});
			const value = renderToString(<DurationFormat value={duration} locale="de-AT" />);
			expect(value).toBe("02:46:40");
		});

		test("balance days de-AT", () => {
			const duration = Now.instant().until(Now.instant().add({hours: 5 * 24}))
				.round({largestUnit: "days"});
			const value = renderToString(<DurationFormat value={duration} locale="de-AT" />);
			expect(value).toBe("5d");
		});

		test("complex de-AT", () => {
			const duration = Duration.from({years: 3, months: 4, weeks: 1, days: 6});
			const value = renderToString(<DurationFormat value={duration} locale="de-AT" />);
			expect(value).toBe("3y 4m 1w 6d");
		});
	});
});
