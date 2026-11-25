import {describe, expect, test} from "vitest";
import {PlainTime} from "../temporal";
import {PlainTimeAdapter} from "./PlainTimeAdapter";

describe("PlainTimeAdapter", () => {
	const adapter = new PlainTimeAdapter({locale: "de"});

	test("getDiff", () => {
		expect(adapter.getDiff(PlainTime.from("08:00"), PlainTime.from("10:30"), "minutes")).toBe(150);
		// Calendar units need a date: two times of day are less than a day apart.
		expect(adapter.getDiff(PlainTime.from("08:00"), PlainTime.from("10:30"), "months")).toBe(0);
	});
});
