import {DateTimeFormat, PlainDate} from "../temporal";

interface FormatStringPlaceholder {
    year: string;
    month: string;
    day: string;
}

export function getFormatString(format: DateTimeFormat, {year, month, day}: FormatStringPlaceholder) {
    // derive a format string from a fictional date
    return format.format(new PlainDate(9999, 11, 22))
        .replace(/9+/, year)
        .replace(/1+/, month)
        .replace(/2+/, day);
}