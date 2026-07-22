import * as React from "react";
import {Fragment, useMemo} from "react";
import {getSupportedFormatLocale} from "../getSupportedFormatLocale";
import {Duration} from "../temporal";
import {DateStyle, TimeStyle} from "./types";

export type DurationFormatStyle = "long" | "short" | "narrow" | "digital";

interface DurationFormatProps {
	/**
	 * The duration value to format.
	 */
	value?: Duration | null | undefined;

	/**
	 * The style of the duration format, as supported by `Intl.DurationFormat`.
	 * Defaults to `narrow`.
	 */
	style?: DurationFormatStyle;

	/**
	 * @deprecated Has no effect. Use `style` instead.
	 */
	dateStyle?: DateStyle | undefined;

	/**
	 * @deprecated Has no effect. Use `style` instead.
	 */
	timeStyle?: TimeStyle | undefined;

	/**
	 * Overrides the user's locale. Use for testing only.
	 */
	locale?: string;
}

interface IntlDurationFormat {
	format(duration: Partial<Record<string, number>>): string;
}

type IntlDurationFormatConstructor = new(
	locale?: string,
	options?: { style?: DurationFormatStyle },
) => IntlDurationFormat;

export function DurationFormat(props: DurationFormatProps) {
	const {
		value,
		style = "narrow",
		locale: suppliedLocale,
	} = props;

	if (!value) {
		return null;
	}

	const locale = useMemo(() => suppliedLocale ?? getSupportedFormatLocale("dateTime"), [suppliedLocale]);

	const strValue = useMemo(() => {
		// resolved at render time, so the fallback also applies when the constructor is mocked away in tests
		const DurationFormatConstructor = (Intl as any).DurationFormat as IntlDurationFormatConstructor | undefined;
		if (DurationFormatConstructor) {
			try {
				return new DurationFormatConstructor(locale, {style}).format(toDurationRecord(value));
			}
			catch (error) {
				// fall back to the manual format below
			}
		}
		return formatDuration(value);
	}, [value, locale, style]);

	return <Fragment>{strValue}</Fragment>;
}

function toDurationRecord(value: Duration) {
	const record: Partial<Record<string, number>> = {};
	for (const unit of ["years", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds"] as const) {
		if (value[unit] !== 0) {
			record[unit] = value[unit];
		}
	}
	return record;
}

/**
 * Manual, non-localized duration format, used where `Intl.DurationFormat` is unavailable.
 */
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
