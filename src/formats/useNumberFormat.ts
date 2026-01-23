import {useMemo} from "react";
import {getSupportedFormatLocale} from "../getSupportedFormatLocale";

export function useNumberFormat(options?: Intl.NumberFormatOptions, locale?: string) {
	return useMemo(() => new Intl.NumberFormat(locale ?? getSupportedFormatLocale("number"), options), [options]);
}
