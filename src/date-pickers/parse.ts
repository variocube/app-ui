import {DateTimeFormat, PlainDate, PlainDateTime} from "../temporal";
import {getFormatString} from "./getFormatString";

const PLACEHOLDER = {
    year: "year",
    month: "month",
    day: "day",
    hour: "hour",
    minute: "minute",
    second: "second",
} as const;

export function parsePlainDate(value: string, format: DateTimeFormat) {
    return PlainDate.from(parse(value, format), {overflow: "reject"});
}

export function parsePlainDateTime(value: string, format: DateTimeFormat) {
    return PlainDateTime.from(parse(value, format), {overflow: "reject"});
}

function parse(value: string, format: DateTimeFormat) {
    // throw an error on unsupported numbering systems
    if (format.resolvedOptions().numberingSystem != "latn") {
        throw new Error("Parsing numbering systems other than `latn` is not supported");
    }
    const formatString = getFormatString(format, PLACEHOLDER);
    return parseFormat(formatString, Object.values(PLACEHOLDER), value);
}

function parseFormat<F extends string>(format: string, formatParts: F[], value: string) {
    const parsed = {} as Record<F, number>;
    for (const token of tokenize(format, formatParts)) {
        if (isFormat(token, formatParts)) {
            const matchStr = value.match(/^\d+/)?.pop();
            if (matchStr) {
                parsed[token] = parseInt(matchStr);
                value = value.substring(matchStr.length);
            }
            else {
                throw new Error("Could not parse number: " + value);
            }
        }
        else {
            if (value.startsWith(token)) {
                value = value.substring(token.length);
            }
            else {
                throw new Error(`Expected "${token}", but got "${value[0]}"`);
            }
        }
    }
    return parsed;
}

function tokenize(format: string, formatParts: string[]) {
    const tokens = [];
    while (format.length > 0) {
        // match the next format part or single char
        const token = formatParts.find(part => format.startsWith(part)) || format[0];
        tokens.push(token);
        format = format.substring(token.length);
    }
    return tokens;
}

function isFormat<F extends string>(c: string, formatParts: F[]): c is F {
    return formatParts.includes(c as F);
}