import {useMemo} from "react";
import {DateTimeFormatOptions, Formattable, ZonedDateTime} from "../temporal";
import {DateStyle, TimeStyle} from "./types";

/**
 * What `TemporalFormat` and `TemporalRangeFormat` format: anything `Intl.DateTimeFormat` formats, and a
 * `ZonedDateTime`, which the spec leaves out.
 */
export type TemporalFormattable = Formattable | ZonedDateTime;

export interface TemporalFormatOptionsRequest {
	/** The values to format. The first `ZonedDateTime` among them gives the time zone. */
	values: ReadonlyArray<TemporalFormattable | null | undefined>;
	dateStyle: DateStyle | undefined;
	timeStyle: TimeStyle | undefined;
	/** Overrides the time zone, also that of a `ZonedDateTime`. */
	timeZone: string | undefined;
}

/**
 * The fields shown for a `ZonedDateTime` without `dateStyle` and `timeStyle`: the `Intl.DateTimeFormat` defaults for
 * an `Instant` plus the zone's name, which is how @js-temporal/polyfill 0.4 formatted a `ZonedDateTime`.
 */
const ZONED_DEFAULTS: DateTimeFormatOptions = {
	year: "numeric",
	month: "numeric",
	day: "numeric",
	hour: "numeric",
	minute: "2-digit",
	second: "2-digit",
	timeZoneName: "short",
};

/**
 * Returns memoized options for an `Intl.DateTimeFormat` formatting the values. Per spec, `Intl.DateTimeFormat` throws
 * for a `ZonedDateTime`, so a `ZonedDateTime` is formatted as its instant (see `toFormattable`) in its own time zone.
 */
export function useTemporalFormatOptions(request: TemporalFormatOptionsRequest): DateTimeFormatOptions {
	const {values, dateStyle, timeStyle, timeZone} = request;
	const zonedTimeZone = values.find(isZonedDateTime)?.timeZoneId;
	return useMemo(() => {
		const styles = {dateStyle, timeStyle};
		if (zonedTimeZone == undefined) {
			return {...styles, timeZone};
		}
		const fields = dateStyle || timeStyle ? styles : ZONED_DEFAULTS;
		return {...fields, timeZone: timeZone ?? zonedTimeZone};
	}, [dateStyle, timeStyle, timeZone, zonedTimeZone]);
}

/** Returns what `Intl.DateTimeFormat` formats: the instant of a `ZonedDateTime`, any other value as it is. */
export function toFormattable(value: TemporalFormattable): Formattable {
	return isZonedDateTime(value) ? value.toInstant() : value;
}

function isZonedDateTime(value: TemporalFormattable | null | undefined): value is ZonedDateTime {
	return value != null && value instanceof ZonedDateTime;
}
