import {PlainDate} from "../temporal";
import {PlainDateAdapter} from "./PlainDateAdapter";

describe("PlainDateAdapter", () => {
	const adapter = new PlainDateAdapter({locale: "de"});

	test("isSameDay", () => {
		expect(adapter.isSameDay(new PlainDate(2022, 5, 30), new PlainDate(2022, 5, 30))).toBe(true);
		expect(adapter.isSameDay(new PlainDate(2022, 4, 30), new PlainDate(2022, 5, 30))).toBe(false);
	});

	test("isSameYear", () => {
		expect(adapter.isSameYear(new PlainDate(2022, 5, 30), new PlainDate(2022, 5, 30))).toBe(true);
		expect(adapter.isSameYear(new PlainDate(2022, 4, 30), new PlainDate(2022, 5, 30))).toBe(true);
		expect(adapter.isSameYear(new PlainDate(2020, 4, 30), new PlainDate(2022, 5, 30))).toBe(false);
	});

	test("startOfWeek", () => {
		const startOfWeek = adapter.startOfWeek(new PlainDate(2022, 5, 31));
		expect(startOfWeek.year).toBe(2022);
		expect(startOfWeek.month).toBe(5);
		expect(startOfWeek.day).toBe(30);
	});

	test("endOfWeek", () => {
		const startOfWeek = adapter.endOfWeek(new PlainDate(2022, 5, 31));
		expect(startOfWeek.year).toBe(2022);
		expect(startOfWeek.month).toBe(6);
		expect(startOfWeek.day).toBe(5);
	});

	test("getYearRange", () => {
		const range = adapter.getYearRange(PlainDate.from("2020-05-05"), PlainDate.from("2025-05-05"));
		expect(range).toHaveLength(5);
	});

	test("getWeekArray", () => {
		const weekArray = adapter.getWeekArray(new PlainDate(2022, 5, 30));
		expect(weekArray).toHaveLength(6);
		expect(weekArray[0][0].toString()).toBe("2022-04-25"); // monday of first week
		expect(weekArray[5][6].toString()).toBe("2022-06-05"); // sunday of last week
	});

	test("getYearRange", () => {
		const yearRange = adapter.getYearRange(new PlainDate(1995, 1, 1), new PlainDate(2020, 1, 1));
		expect(yearRange).toHaveLength(25);
	});
});
