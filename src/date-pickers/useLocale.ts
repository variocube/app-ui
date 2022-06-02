import {useMemo} from "react";
import {getNavigatorLanguages} from "../getNavigatorLanguages";
import {DateTimeFormat} from "../temporal";

export function useLocale(suppliedLocale: string | undefined) {
    return useMemo(() => suppliedLocale || findSupportedLocale(), [suppliedLocale]);
}

export function findSupportedLocale() {
    return getNavigatorLanguages()
        .find(locale => locale == new DateTimeFormat(locale).resolvedOptions().locale);
}