import * as React from "react";
import {act, create, ReactTestRenderer} from "react-test-renderer";
import {Instant, PlainDate, PlainDateTime, PlainTime, ZonedDateTime} from "../temporal";
import {TemporalRangeFormat} from "./TemporalRangeFormat";

describe("TemporalRangeFormat", () => {
	test("PlainDate de-AT", () => {
		let element: ReactTestRenderer;
		act(() => {
			element = create(
				<TemporalRangeFormat
					from={PlainDate.from("2022-06-22")}
					until={PlainDate.from("2022-06-30")}
					locale="de-AT"
				/>,
			);
		});
		const value = element!.root.children[0];
		expect(value).toBe("22.–30.06.2022");
	});

	test("PlainDate en-US", () => {
		let element: ReactTestRenderer;
		act(() => {
			element = create(
				<TemporalRangeFormat
					from={PlainDate.from("2022-06-22")}
					until={PlainDate.from("2022-06-30")}
					locale="en-US"
				/>,
			);
		});
		const value = element!.root.children[0];
		expect(value).toBe("6/22/2022 – 6/30/2022");
	});

	test("PlainDateTime de-AT", () => {
		let element: ReactTestRenderer;
		act(() => {
			element = create(
				<TemporalRangeFormat
					from={PlainDateTime.from("2022-06-22T14:22")}
					until={PlainDateTime.from("2022-06-22T17:55")}
					locale="de-AT"
				/>,
			);
		});
		const value = element!.root.children[0];
		expect(value).toBe("22.6.2022, 14:22:00 – 17:55:00");
	});

	test("PlainDateTime en-US", () => {
		let element: ReactTestRenderer;
		act(() => {
			element = create(
				<TemporalRangeFormat
					from={PlainDateTime.from("2022-06-22T14:22")}
					until={PlainDateTime.from("2022-06-22T17:55")}
					locale="en-US"
				/>,
			);
		});
		const value = element!.root.children[0];
		expect(value).toBe("6/22/2022, 2:22:00 PM – 5:55:00 PM");
	});

	test("PlainTime de-AT", () => {
		let element: ReactTestRenderer;
		act(() => {
			element = create(
				<TemporalRangeFormat
					from={PlainTime.from({hour: 14, minute: 22})}
					until={PlainTime.from({hour: 18, minute: 0, second: 3})}
					locale="de-AT"
				/>,
			);
		});
		const value = element!.root.children[0];
		expect(value).toBe("14:22:00 – 18:00:03");
	});

	test("PlainTime en-US", () => {
		let element: ReactTestRenderer;
		act(() => {
			element = create(
				<TemporalRangeFormat
					from={PlainTime.from({hour: 14, minute: 22})}
					until={PlainTime.from({hour: 18, minute: 0, second: 3})}
					locale="en-US"
				/>,
			);
		});
		const value = element!.root.children[0];
		expect(value).toBe("2:22:00 PM – 6:00:03 PM");
	});

	test("ZonedDateTime de-AT", () => {
		let element: ReactTestRenderer;
		act(() => {
			element = create(
				<TemporalRangeFormat
					from={ZonedDateTime.from("2022-06-22T14:22[MET]")}
					until={ZonedDateTime.from("2022-06-22T19:22[MET]")}
					locale="de-AT"
				/>,
			);
		});
		const value = element!.root.children[0];
		expect(value).toBe("22.6.2022, 14:22:00 MESZ – 19:22:00 MESZ");
	});

	test("ZonedDateTime en-US", () => {
		let element: ReactTestRenderer;
		act(() => {
			element = create(
				<TemporalRangeFormat
					from={ZonedDateTime.from("2022-06-22T14:22[MET]")}
					until={ZonedDateTime.from("2022-06-22T19:22[MET]")}
					locale="en-US"
				/>,
			);
		});
		const value = element!.root.children[0];
		expect(value).toBe("6/22/2022, 2:22:00 PM GMT+2 – 7:22:00 PM GMT+2");
	});

	test("Instant de-AT", () => {
		let element: ReactTestRenderer;
		act(() => {
			element = create(
				<TemporalRangeFormat
					from={Instant.from("2022-06-22T14:22:11Z")}
					until={Instant.from("2024-01-30T08:14:32Z")}
					timeZone="Europe/Vienna"
					locale="de-AT"
				/>,
			);
		});
		const value = element!.root.children[0];
		expect(value).toBe("22.6.2022, 16:22:11 – 30.1.2024, 09:14:32");
	});

	test("Instant en-US", () => {
		let element: ReactTestRenderer;
		act(() => {
			element = create(
				<TemporalRangeFormat
					from={Instant.from("2022-06-22T14:22:11Z")}
					until={Instant.from("2024-01-30T08:14:32Z")}
					locale="en-US"
					timeZone="UTC"
				/>,
			);
		});
		const value = element!.root.children[0];
		expect(value).toBe("6/22/2022, 2:22:11 PM – 1/30/2024, 8:14:32 AM");
	});
});
