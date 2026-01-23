import {getNavigatorLanguages} from "./getNavigatorLanguages";
import {DateTimeFormat} from "./temporal";

export const IntlFormats = {
	"number": Intl.NumberFormat,
	"relativeTime": Intl.RelativeTimeFormat,
	"dateTime": DateTimeFormat,
} as const;

export type IntlFormat = keyof typeof IntlFormats;

const supportedLocaleCache = {} as Record<IntlFormat, string>;

export function getSupportedFormatLocale(format: IntlFormat) {
	return supportedLocaleCache[format] ?? findSupportedFormatLocale(format);
}

function findSupportedFormatLocale(format: IntlFormat) {
	const formatCtor = IntlFormats[format];
	const locale = getNavigatorLanguages()
		.find(locale => locale == new formatCtor(locale).resolvedOptions().locale) ?? "default";
	supportedLocaleCache[format] = locale;
	return locale;
}
