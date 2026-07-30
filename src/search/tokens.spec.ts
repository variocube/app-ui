import {tokenize, tokensEqual} from "./tokens";

describe("tokenize", () => {
	test("splits on whitespace", () => {
		expect(tokenize("foo bar")).toEqual(["foo", "bar"]);
	});

	test("ignores leading, trailing and repeated whitespace", () => {
		expect(tokenize("  foo \t bar\n baz  ")).toEqual(["foo", "bar", "baz"]);
	});

	test("returns empty array for empty or blank input", () => {
		expect(tokenize("")).toEqual([]);
		expect(tokenize("   ")).toEqual([]);
	});
});

describe("tokensEqual", () => {
	test("equal token lists", () => {
		expect(tokensEqual(["foo", "bar"], ["foo", "bar"])).toBe(true);
		expect(tokensEqual([], [])).toBe(true);
	});

	test("different length", () => {
		expect(tokensEqual(["foo"], ["foo", "bar"])).toBe(false);
	});

	test("different order", () => {
		expect(tokensEqual(["foo", "bar"], ["bar", "foo"])).toBe(false);
	});
});
