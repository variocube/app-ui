import {useMemo} from "react";
import {getSupportedFormatLocale} from "../getSupportedFormatLocale";

export function useRelativeTimeFormat(options?: Intl.RelativeTimeFormatOptions, locale?: string) {
	return useMemo(() => new Intl.RelativeTimeFormat(locale ?? getSupportedFormatLocale("relativeTime"), options), [
		options,
	]);
}
