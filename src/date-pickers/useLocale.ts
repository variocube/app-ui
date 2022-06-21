import {useMemo} from "react";
import {getSupportedFormatLocale} from "../getSupportedFormatLocale";

export function useLocale(suppliedLocale: string | undefined) {
    return useMemo(() => suppliedLocale || getSupportedFormatLocale("dateTime"), [suppliedLocale]);
}
