import {Fragment, useMemo} from "react";
import * as React from "react";
import {DateStyle, TimeStyle} from "./types";
import {useDateTimeFormat} from "./useDateTimeFormat";
import {TemporalFormattable, toFormattable, useTemporalFormatOptions} from "./useTemporalFormatOptions";

export interface TemporalRangeFormatProps {
	/**
	 * The beginning of the temporal range. A `ZonedDateTime` is formatted in its own time zone, unless `timeZone` is
	 * given. Should `from` and `until` be in different time zones, both are formatted in that of `from`.
	 */
	from: TemporalFormattable;

	/**
	 * The end of the temporal range.
	 */
	until: TemporalFormattable;

	/**
	 * The style of the date format.
	 */
	dateStyle?: DateStyle | undefined;

	/**
	 * The style of the time format.
	 */
	timeStyle?: TimeStyle | undefined;

	/**
	 * Overrides the user's locale. Use for testing only.
	 */
	locale?: string;

	/**
	 * Overrides the user's time zone. Use for testing only.
	 */
	timeZone?: string;
}

export function TemporalRangeFormat(props: TemporalRangeFormatProps) {
	const {
		from,
		until,
		dateStyle,
		timeStyle,
		locale,
		timeZone,
	} = props;

	const options = useTemporalFormatOptions({values: [from, until], dateStyle, timeStyle, timeZone});

	const dateTimeFormat = useDateTimeFormat(options, locale);

	const str = useMemo(() => {
		return dateTimeFormat.formatRange(toFormattable(from), toFormattable(until));
	}, [dateTimeFormat, from, until]);

	return <Fragment>{str}</Fragment>;
}
