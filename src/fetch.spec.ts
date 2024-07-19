import {createQueryString} from "./fetch";

describe("createQueryString", () => {
	test("simple", () => {
		expect(createQueryString({foo: "bar"})).toEqual("foo=bar");
	});
	test("number", () => {
		expect(createQueryString({foo: 5})).toEqual("foo=5");
		expect(createQueryString({foo: 42.01})).toEqual("foo=42.01");
	});
	test("multi", () => {
		expect(createQueryString({foo: "bar"}, {foo: "baz"})).toEqual("foo=bar&foo=baz");
		expect(createQueryString({one: 1}, {two: 2})).toEqual("one=1&two=2");
	});
	test("array", () => {
		expect(createQueryString({foo: ["bar", "baz"]})).toEqual("foo=bar&foo=baz");
		expect(createQueryString({foo: ["bar", "baz"]}, {foo: ["bar2", "baz2"]})).toEqual(
			"foo=bar&foo=baz&foo=bar2&foo=baz2",
		);
	});
});
