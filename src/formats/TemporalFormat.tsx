import * as React from "react";
import {Fragment, useMemo} from "react";
import {DateStyle, TimeStyle} from "./types";
import {useDateTimeFormat} from "./useDateTimeFormat";
import {TemporalFormattable, toFormattable, useTemporalFormatOptions} from "./useTemporalFormatOptions";

export interface TemporalFormatProps {
	/**
	 * The date value to format. A `ZonedDateTime` is formatted in its own time zone, unless `timeZone` is given.
	 */
	value?: TemporalFormattable | null | undefined;

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

export function useTemporalFormat(props: TemporalFormatProps) {
	const {
		value,
		dateStyle,
		timeStyle,
		locale,
		timeZone,
	} = props;

	const options = useTemporalFormatOptions({values: [value], dateStyle, timeStyle, timeZone});

	const dateTimeFormat = useDateTimeFormat(options, locale);

	return useMemo(() => {
		return value != null ? dateTimeFormat.format(toFormattable(value)) : "";
	}, [dateTimeFormat, value]);
}

export function TemporalFormat(props: TemporalFormatProps) {
	return <Fragment>{useTemporalFormat(props)}</Fragment>;
}
