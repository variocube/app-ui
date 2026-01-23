import * as React from "react";
import {Fragment, useMemo} from "react";
import {getSupportedFormatLocale} from "../getSupportedFormatLocale";
import {Duration} from "../temporal";
import {DateStyle, TimeStyle} from "./types";

interface DurationFormatProps {
	/**
	 * The duration value to format.
	 */
	value?: Duration | null | undefined;

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
}

export function DurationFormat(props: DurationFormatProps) {
	const {
		value,
		dateStyle,
		timeStyle,
		locale: suppliedLocale,
	} = props;

	if (!value) {
		return null;
	}

	const options = useMemo(() => ({
		dateStyle,
		timeStyle,
	}), [dateStyle, timeStyle]);

	const locale = useMemo(() => suppliedLocale ?? getSupportedFormatLocale("dateTime"), [suppliedLocale]);

	const strValue = useMemo(() => {
		// TODO: this can only be supported once a polyfill or browser support for DurationFormat is available
		// https://github.com/tc39/proposal-intl-duration-format/
		// In the meantime, we format the duration in a simple neural format.
		return formatDuration(value);
	}, [value, locale, options]);

	return <Fragment>{strValue}</Fragment>;
}

function formatDuration(value: Duration) {
	const parts = (["years", "months", "weeks", "days"] as const)
		.map(prop => [prop, value[prop]] as const)
		.filter(([_, value]) => Boolean(value))
		.map(([prop, value]) => value + prop.charAt(0));

	if (value.hours || value.minutes || value.seconds) {
		const time = [value.hours || 0, value.minutes || 0, value.seconds]
			.map(value => value.toString().padStart(2, "0"))
			.join(":");
		parts.push(time);
	}

	return parts.join(" ");
}
