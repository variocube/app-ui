import {afterEach, beforeEach, describe, expect, test, vi} from "vitest";

/** What installing the polyfill changes, to be restored after each test. */
const INSTALLED = [[globalThis, "Temporal"], [Intl, "DateTimeFormat"], [Date.prototype, "toTemporalInstant"]] as const;

type TemporalGlobal = typeof globalThis & { Temporal?: unknown };

describe("polyfill", () => {
	let saved: Array<PropertyDescriptor | undefined>;

	beforeEach(() => {
		saved = INSTALLED.map(([target, key]) => Object.getOwnPropertyDescriptor(target, key));
		vi.resetModules();
	});

	afterEach(() => {
		INSTALLED.forEach(([target, key], index) => {
			const descriptor = saved[index];
			if (descriptor) {
				Object.defineProperty(target, key, descriptor);
			}
			else {
				Reflect.deleteProperty(target, key);
			}
		});
	});

	function setGlobalTemporal(value: unknown) {
		Object.defineProperty(globalThis, "Temporal", {value, configurable: true, writable: true});
	}

	test("installs the polyfill without a native Temporal", async () => {
		Reflect.deleteProperty(globalThis, "Temporal");
		const {Instant, Now} = await import("./polyfill");
		expect(typeof Now.timeZoneId()).toBe("string");
		expect(Instant).toBe((globalThis as TemporalGlobal & { Temporal: { Instant: unknown } }).Temporal.Instant);
	});

	test("replaces an outdated native Temporal by the polyfill", async () => {
		// Like Node 24 with --harmony-temporal or an early browser release: `Now.timeZone()`, `ZonedDateTime#timeZone`.
		const outdated = {
			Now: {timeZone: () => "UTC"},
			ZonedDateTime: class {
				get timeZone() {
					return "UTC";
				}
			},
		};
		setGlobalTemporal(outdated);
		const {DateTimeFormat, Instant, Now} = await import("./polyfill");
		expect((globalThis as TemporalGlobal).Temporal).not.toBe(outdated);
		expect(typeof Now.timeZoneId()).toBe("string");
		const instant = Instant.from("2022-06-22T14:22:11Z");
		expect(new DateTimeFormat("de-AT", {timeZone: "UTC"}).format(instant)).toBe("22.6.2022, 14:22:11");
	});

	test("keeps a spec-current native Temporal", async () => {
		const native = {
			Instant: class {},
			Now: {timeZoneId: () => "UTC"},
			ZonedDateTime: class {
				get timeZoneId() {
					return "UTC";
				}
			},
		};
		setGlobalTemporal(native);
		const {Instant, Now, ZonedDateTime} = await import("./polyfill");
		expect((globalThis as TemporalGlobal).Temporal).toBe(native);
		expect(Instant).toBe(native.Instant);
		expect(Now).toBe(native.Now);
		expect(ZonedDateTime).toBe(native.ZonedDateTime);
	});

	test("toTemporalInstant converts the Date it is called on", async () => {
		const {toTemporalInstant} = await import("./polyfill");
		expect(toTemporalInstant.call(new Date(Date.UTC(2022, 5, 22, 14, 22, 11))).toString())
			.toBe("2022-06-22T14:22:11Z");
	});
});
