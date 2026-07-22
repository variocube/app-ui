import {splitHighlightParts} from "./highlightParts";

describe("splitHighlightParts", () => {
	test("no highlight returns single non-highlighted part", () => {
		expect(splitHighlightParts("hello world", undefined)).toEqual([
			{text: "hello world", highlight: false},
		]);
		expect(splitHighlightParts("hello world", "")).toEqual([
			{text: "hello world", highlight: false},
		]);
	});

	test("highlights a matching word", () => {
		expect(splitHighlightParts("hello world", "world")).toEqual([
			{text: "hello ", highlight: false},
			{text: "world", highlight: true},
		]);
	});

	test("matches case-insensitively but preserves original casing", () => {
		expect(splitHighlightParts("Hello World", "hello")).toEqual([
			{text: "Hello", highlight: true},
			{text: " World", highlight: false},
		]);
	});

	test("matches inside words", () => {
		expect(splitHighlightParts("unbelievable", "lievab")).toEqual([
			{text: "unbe", highlight: false},
			{text: "lievab", highlight: true},
			{text: "le", highlight: false},
		]);
	});

	test("highlights each word of a multi-word query", () => {
		expect(splitHighlightParts("John Doe", "doe john")).toEqual([
			{text: "John", highlight: true},
			{text: " ", highlight: false},
			{text: "Doe", highlight: true},
		]);
	});

	test("merges overlapping matches", () => {
		expect(splitHighlightParts("abcdef", "abcd cdef")).toEqual([
			{text: "abcdef", highlight: true},
		]);
	});

	test("no match returns single non-highlighted part", () => {
		expect(splitHighlightParts("hello world", "xyz")).toEqual([
			{text: "hello world", highlight: false},
		]);
	});

	test("folds simple diacritics", () => {
		expect(splitHighlightParts("Café Müller", "cafe muller")).toEqual([
			{text: "Café", highlight: true},
			{text: " ", highlight: false},
			{text: "Müller", highlight: true},
		]);
	});

	test("matches only the first occurrence of a word", () => {
		expect(splitHighlightParts("foo bar foo", "foo")).toEqual([
			{text: "foo", highlight: true},
			{text: " bar foo", highlight: false},
		]);
	});
});
