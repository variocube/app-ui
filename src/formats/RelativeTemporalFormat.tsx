import * as React from "react";
import {Fragment, useMemo} from "react";
import {Duration, Instant, Now, PlainDate, PlainDateTime, ZonedDateTime} from "../temporal";
import {useRelativeTimeFormat} from "./useRelativeTimeFormat";

export interface RelativeTemporalFormatProps {
	/** The value to format. */
	value?: PlainDate | PlainDateTime | ZonedDateTime | Instant | null | undefined;

	/** The format of output message. */
	numeric?: "always" | "auto" | undefined;

	/** The length of the internationalized message */
	style?: "long" | "short" | "narrow" | undefined;

	/**
	 * Overrides the user's locale. Use for testing only.
	 */
	locale?: string;
}

/**
 * Returns a Temporal type formatted as relative time.
 */
export function useRelativeTemporalFormat(props: RelativeTemporalFormatProps) {
	const {
		value,
		numeric = "auto",
		style,
		locale,
	} = props;

	const options = useMemo(() => ({
		numeric,
		style,
	}), [numeric, style]);

	// Convert the given value to a duration relative to "now", rounded to the largest unit.
	// Unfortunately this is not straightforward and there might even be bugs in the polyfill.
	const duration = useMemo(() => {
		if (value instanceof PlainDate) {
			const relativeTo = Now.plainDateISO();
			return value.since(relativeTo, {largestUnit: "auto"})
				.round({largestUnit: "years", relativeTo});
		}
		if (value instanceof PlainDateTime) {
			const relativeTo = Now.plainDateTimeISO();
			return value.since(relativeTo, {largestUnit: "auto"})
				.round({largestUnit: "years", relativeTo});
		}
		if (value instanceof ZonedDateTime) {
			const relativeTo = Now.zonedDateTimeISO();
			return value.since(relativeTo, {largestUnit: "auto"})
				.round({largestUnit: "years", relativeTo});
		}
		if (value instanceof Instant) {
			const now = Now.instant();
			const relativeTo = now.toZonedDateTimeISO(Now.timeZone());
			return value.since(now, {largestUnit: "auto"})
				.round({largestUnit: "years", relativeTo}) // first time rounds to hours
				.round({largestUnit: "years", relativeTo}); // second time round to years
		}
		return undefined;
	}, [value]);

	const format = useRelativeTimeFormat(options, locale);

	return useMemo(() => {
		return duration ? format.format(...convertDuration(duration)) : "";
	}, [format, duration]);
}

/**
 * Displays a Temporal type formatted as relative time.
 */
export function RelativeTemporalFormat(props: RelativeTemporalFormatProps) {
	return <Fragment>{useRelativeTemporalFormat(props)}</Fragment>;
}

type RelativeDateTimeFormatArgs = [number, Intl.RelativeTimeFormatUnit];

function convertDuration(duration: Duration): RelativeDateTimeFormatArgs {
	const props = ["years", "months", "weeks", "days", "hours", "minutes", "seconds"] as const;
	const prop = props.find(prop => Boolean(duration[prop]));
	return prop ? [duration[prop], prop] : [0, "seconds"];
}
