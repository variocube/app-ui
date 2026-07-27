import {tryParseDuration} from "./parse";

describe("tryParseDuration", () => {
	test("parses an ISO-8601 period", () => {
		const duration = tryParseDuration("P1Y2M3D");
		expect(duration?.years).toBe(1);
		expect(duration?.months).toBe(2);
		expect(duration?.days).toBe(3);
	});

	test("parses an ISO-8601 duration with time components", () => {
		const duration = tryParseDuration("PT2H30M");
		expect(duration?.hours).toBe(2);
		expect(duration?.minutes).toBe(30);
	});

	test("returns null for invalid input", () => {
		expect(tryParseDuration("foo")).toBeNull();
		expect(tryParseDuration("")).toBeNull();
		expect(tryParseDuration(null)).toBeNull();
		expect(tryParseDuration(undefined)).toBeNull();
	});
});
