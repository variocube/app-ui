import {useMemo} from "react";
import {getSupportedFormatLocale} from "../getSupportedFormatLocale";
import {DateTimeFormat, DateTimeFormatOptions} from "../temporal";

export function useDateTimeFormat(options?: DateTimeFormatOptions, locale?: string) {
	return useMemo(() => new DateTimeFormat(locale ?? getSupportedFormatLocale("dateTime"), options), [
		options,
		locale,
	]);
}
