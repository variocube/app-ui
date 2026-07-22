import {Duration, Instant, PlainDate, PlainDateTime, PlainTime} from "./polyfill";

export function tryParsePlainDate(value: string | undefined | null) {
	return tryParseString(value, v => PlainDate.from(v, {overflow: "reject"}));
}

export function tryParsePlainDateTime(value: string | undefined | null) {
	return tryParseString(value, v => PlainDateTime.from(v, {overflow: "reject"}));
}

export function tryParsePlainTime(value: string | undefined | null) {
	return tryParseString(value, v => PlainTime.from(v, {overflow: "reject"}));
}

export function tryParseInstant(value: string | undefined | null) {
	return tryParseString(value, Instant.from);
}

export function tryParseDuration(value: string | undefined | null) {
	return tryParseString(value, Duration.from);
}

function tryParseString<T>(value: string | undefined | null, parseFn: (value: string) => T) {
	if (value) {
		try {
			return parseFn(value);
		}
		catch (error) {
			// ignore parse error
		}
	}
	return null;
}
