import {PlainDateTime} from "../temporal";
import {PlainDateTimeAdapter} from "./PlainDateTimeAdapter";

describe("PlainDateTimeAdapter", () => {
	const adapter = new PlainDateTimeAdapter({locale: "de"});

	test("isSameDay", () => {
		expect(adapter.isSameDay(new PlainDateTime(2022, 5, 30), new PlainDateTime(2022, 5, 30))).toBe(true);
		expect(adapter.isSameDay(new PlainDateTime(2022, 4, 30), new PlainDateTime(2022, 5, 30))).toBe(false);
	});

	test("isSameYear", () => {
		expect(adapter.isSameYear(new PlainDateTime(2022, 5, 30), new PlainDateTime(2022, 5, 30))).toBe(true);
		expect(adapter.isSameYear(new PlainDateTime(2022, 4, 30), new PlainDateTime(2022, 5, 30))).toBe(true);
		expect(adapter.isSameYear(new PlainDateTime(2020, 4, 30), new PlainDateTime(2022, 5, 30))).toBe(false);
	});

	test("startOfWeek", () => {
		const startOfWeek = adapter.startOfWeek(new PlainDateTime(2022, 5, 31));
		expect(startOfWeek.year).toBe(2022);
		expect(startOfWeek.month).toBe(5);
		expect(startOfWeek.day).toBe(30);
	});

	test("endOfWeek", () => {
		const startOfWeek = adapter.endOfWeek(new PlainDateTime(2022, 5, 31));
		expect(startOfWeek.year).toBe(2022);
		expect(startOfWeek.month).toBe(6);
		expect(startOfWeek.day).toBe(5);
	});

	test("getYearRange", () => {
		const range = adapter.getYearRange(PlainDateTime.from("2020-05-05"), PlainDateTime.from("2025-05-05"));
		expect(range).toHaveLength(5);
	});

	test("getWeekArray", () => {
		const weekArray = adapter.getWeekArray(new PlainDateTime(2022, 5, 30));
		expect(weekArray).toHaveLength(6);
		expect(weekArray[0][0].toString()).toBe("2022-04-25T00:00:00"); // monday of first week
		expect(weekArray[5][6].toString()).toBe("2022-06-05T00:00:00"); // sunday of last week
	});

	test("getYearRange", () => {
		const yearRange = adapter.getYearRange(new PlainDateTime(1995, 1, 1), new PlainDateTime(2020, 1, 1));
		expect(yearRange).toHaveLength(25);
	});
});
