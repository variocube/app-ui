import {getNavigatorLanguages} from "../localization";
import {DateTimeFormat} from "../temporal";

export function findSupportedLocale() {
    return getNavigatorLanguages()
        .find(locale => locale == new DateTimeFormat(locale).resolvedOptions().locale);
}