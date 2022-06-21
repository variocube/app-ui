import {getSupportedFormatLocale} from "../getSupportedFormatLocale";
import {useMemo} from "react";

export function useNumberFormat(options?: Intl.NumberFormatOptions, locale?: string) {
    return useMemo(() => new Intl.NumberFormat(locale ?? getSupportedFormatLocale("number"), options), [options]);
}