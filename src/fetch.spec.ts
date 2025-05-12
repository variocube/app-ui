import {createQueryString, createApiError} from "./fetch";

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

describe("tryExtractErrorMessage", () => {
	test("problem+json with custom properties", async () => {
		const response = new Response(JSON.stringify({
			title: "You do not have enough credit",
			status: 400,
			type: "https://example.com/probs/out-of-credit",
			detail: "Your current balance is 30, but that costs 50.",
			instance: "/account/12345/msgs/abc",
			balance: 30
		}), {status: 400, headers: {"Content-Type": "application/problem+json"}});

		const result = await createApiError(response);
		expect(result.title).toBe("You do not have enough credit");
		expect(result.status).toBe(400);
		expect(result.detail).toBe("Your current balance is 30, but that costs 50.");
		expect(result.instance).toBe("/account/12345/msgs/abc");
		expect(result.balance).toBe(30);
	});
	test("problem+json without custom properties", async () => {
		const response = new Response(JSON.stringify({
			title: "You do not have enough credit",
			status: 400,
			type: "https://example.com/probs/out-of-credit",
			detail: "Your current balance is 30, but that costs 50."
		}), {status: 400, headers: {"Content-Type": "application/problem+json"}});

		const result = await createApiError(response);
		expect(result.title).toBe("You do not have enough credit");
		expect(result.status).toBe(400);
		expect(result.detail).toBe("Your current balance is 30, but that costs 50.");
	});
	test("non-json body", async () => {
		const response = new Response("Page not found.", {status: 404, statusText: "Not found"});
		const result = await createApiError(response);
		expect(result.title).toBe("Not found");
		expect(result.status).toBe(404);
	});
	test("no content", async () => {
		const response = new Response(null, {status: 204, statusText: "No content"});
		const result = await createApiError(response);
		expect(result.title).toBe("No content");
		expect(result.status).toBe(204);
	});
	test("older format", async () => {
		const response = new Response(JSON.stringify({
			error: "Failed to query data.",
			message: "There was a problem with your request.",
		}), {status: 400});
		const result = await createApiError(response);
		expect(result.title).toBe("Failed to query data.");
		expect(result.detail).toBe("There was a problem with your request.");
		expect(result.status).toBe(400);
	});
});
