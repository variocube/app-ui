import {DateTimeFormat, PlainDate} from "../temporal";

export function parsePlainDate(value: string, format: DateTimeFormat) {
    // throw an error on unsupported numbering systems
    if (format.resolvedOptions().numberingSystem != "latn") {
        throw new Error("Parsing numbering systems other than `latn` is not supported");
    }

    // derive a format string from a fictional date
    const formatString = format.format(new PlainDate(9999, 11, 22))
        .replace(/9+/, "y")
        .replace(/1+/, "m")
        .replace(/2+/, "d");

    const parsed = parseFormat(formatString, ["y", "m", "d"], value);

    return PlainDate.from({year: parsed.y, month: parsed.m, day: parsed.d}, {overflow: "reject"});
}


function parseFormat<F extends string>(format: string, formatParts: F[], value: string) {
    const parsed = {} as Record<F, number>;
    for (const c of format) {
        if (isFormat(c, formatParts)) {
            const matchStr = value.match(/^\d+/)?.pop();
            if (matchStr) {
                parsed[c] = parseInt(matchStr);
                value = value.substring(matchStr.length);
            }
            else {
                throw new Error("Could not parse number: " + value);
            }
        }
        else {
            if (value[0] == c) {
                value = value.substring(1);
            }
            else {
                throw new Error(`Expected "${c}", but got "${value[0]}"`);
            }
        }
    }
    return parsed;
}

function isFormat<F extends string>(c: string, formatParts: F[]): c is F {
    return formatParts.includes(c as F);
}