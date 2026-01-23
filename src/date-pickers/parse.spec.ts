import {DateTimeFormat} from "../temporal";
import {parsePlainDate} from "./parse";

describe("parsePlainDate", () => {
	test("can parse locale: de", () => {
		const plainDate = parsePlainDate("31.5.2020", new DateTimeFormat("de", {dateStyle: "short"}));
		expect(plainDate.day).toBe(31);
		expect(plainDate.month).toBe(5);
		expect(plainDate.year).toBe(2020);
	});

	test("can parse locale: en-US", () => {
		const plainDate = parsePlainDate("9/11/2001", new DateTimeFormat("en-US", {dateStyle: "short"}));
		expect(plainDate.day).toBe(11);
		expect(plainDate.month).toBe(9);
		expect(plainDate.year).toBe(2001);
	});

	test("can parse locale: fr", () => {
		const plainDate = parsePlainDate("4/7/2022", new DateTimeFormat("fr", {dateStyle: "short"}));
		expect(plainDate.day).toBe(4);
		expect(plainDate.month).toBe(7);
		expect(plainDate.year).toBe(2022);
	});

	test("throws on non-latn numbering systems", () => {
		expect(() => parsePlainDate("١٩‏/١٢‏/٢٠١٢", new DateTimeFormat("ar-EG", {dateStyle: "short"})))
			.toThrow("Parsing numbering systems other than `latn` is not supported");
	});

	test("throws on invalid date", () => {
		expect(() => parsePlainDate("13/11/2001", new DateTimeFormat("en-US", {dateStyle: "short"})))
			.toThrow();
	});

	test("throws on parse error", () => {
		expect(() => parsePlainDate("9//2001", new DateTimeFormat("en-US", {dateStyle: "short"})))
			.toThrow();
	});
});
