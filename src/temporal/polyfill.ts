/**
 * Provides the Temporal API: the native one where the environment has a spec-current implementation, otherwise
 * `temporal-polyfill`, loaded on demand into a chunk of its own.
 *
 * The top-level `await` makes every module importing this one wait until Temporal is available, so consumers can use
 * the exports below at module load. Installing the polyfill on `globalThis` is only the means to provide these exports
 * (one code path for native and polyfill); consumers must use the exports, not `globalThis.Temporal`, because a
 * bundler drops this module (`"sideEffects": false`) when none of its exports is used.
 */

import type {Intl as TemporalIntl, Temporal} from "temporal-polyfill";

type TemporalGlobal = typeof globalThis & { Temporal?: Partial<typeof Temporal> };

/**
 * Whether the environment has a Temporal implementing the current spec. An outdated or incomplete implementation (an
 * early browser release, Node 24's `--harmony-temporal`) lacks `Now.timeZoneId()` or `ZonedDateTime#timeZoneId`, which
 * the spec introduced in place of `Now.timeZone()` and `ZonedDateTime#timeZone`.
 */
function hasSpecCurrentTemporal() {
	const {Temporal} = globalThis as TemporalGlobal;
	return typeof Temporal?.Now?.timeZoneId == "function"
		&& Temporal.ZonedDateTime?.prototype != undefined
		&& "timeZoneId" in Temporal.ZonedDateTime.prototype;
}

if (!hasSpecCurrentTemporal()) {
	// Unlike `install()`, `installImplementation()` also replaces an outdated `globalThis.Temporal`. It installs a
	// Temporal-aware `Intl.DateTimeFormat` and `Date.prototype.toTemporalInstant` too.
	const {installImplementation} = await import("temporal-polyfill/shim");
	installImplementation();
}

function getTemporal(): typeof Temporal {
	const temporal = (globalThis as typeof globalThis & { Temporal?: typeof Temporal }).Temporal;
	if (!temporal) {
		throw new Error("Temporal is not available after installing the polyfill.");
	}
	return temporal;
}

export const {
	Instant,
	ZonedDateTime,
	PlainDateTime,
	PlainDate,
	PlainTime,
	Now,
	Duration,
} = getTemporal();

export type Instant = Temporal.Instant;
export type ZonedDateTime = Temporal.ZonedDateTime;
export type PlainDateTime = Temporal.PlainDateTime;
export type PlainDate = Temporal.PlainDate;
export type PlainTime = Temporal.PlainTime;
export type Duration = Temporal.Duration;

/**
 * `Intl.DateTimeFormat`, which formats Temporal objects with a spec-current native Temporal as well as with the
 * polyfill installed above. TypeScript's lib types it for `Date` and `number` only, hence the cast.
 */
export const DateTimeFormat = Intl.DateTimeFormat as unknown as typeof TemporalIntl.DateTimeFormat;

export type DateTimeFormat = TemporalIntl.DateTimeFormat;
export type DateTimeFormatOptions = Intl.DateTimeFormatOptions;

/**
 * What `DateTimeFormat` formats. Per spec, a `ZonedDateTime` is not among it: format its instant (see
 * `TemporalFormat`).
 */
export type Formattable = TemporalIntl.FormattableTemporalObject | Date | number;

/** `Date.prototype.toTemporalInstant`, to be called with a `Date` as `this`. */
export function toTemporalInstant(this: Date): Instant {
	return Instant.fromEpochMilliseconds(this.getTime());
}
