import {getSupportedFormatLocale} from "../getSupportedFormatLocale";
import {useMemo} from "react";

export function useRelativeTimeFormat(options?: Intl.RelativeTimeFormatOptions, locale?: string) {
    return useMemo(() => new Intl.RelativeTimeFormat(locale ?? getSupportedFormatLocale("relativeTime"), options), [options]);
}