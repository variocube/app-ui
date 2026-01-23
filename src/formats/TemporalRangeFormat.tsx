import {Fragment, useMemo} from "react";
import * as React from "react";
import {Formattable} from "../temporal";
import {DateStyle, TimeStyle} from "./types";
import {useDateTimeFormat} from "./useDateTimeFormat";

export interface TemporalRangeFormatProps {
	/**
	 * The beginning of the temporal range.
	 */
	from: Formattable;

	/**
	 * The end of the temporal range.
	 */
	until: Formattable;

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

	const options = useMemo(() => ({
		dateStyle,
		timeStyle,
		timeZone,
	}), [dateStyle, timeStyle]);

	const dateTimeFormat = useDateTimeFormat(options, locale);

	const str = useMemo(() => {
		return dateTimeFormat.formatRange(from, until);
	}, [dateTimeFormat, from, until]);

	return <Fragment>{str}</Fragment>;
}
