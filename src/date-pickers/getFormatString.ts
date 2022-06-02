import {DateTimeFormat, PlainDateTime} from "../temporal";

interface FormatStringPlaceholder {
    year?: string;
    month?: string;
    day?: string;
    hour?: string;
    minute?: string;
    second?: string;
}

export function getFormatString(format: DateTimeFormat, placeholder: FormatStringPlaceholder) {
    const {year, month, day, hour, minute, second} = placeholder;

    // derive a format string from a fictional date
    let formatString = format.format(new PlainDateTime(9999, 11, 22, 0, 33, 44))

    if (year) {
        formatString = formatString.replace(/9+/, year);
    }
    if (month) {
        formatString = formatString.replace(/1+/, month);
    }
    if (day) {
        formatString = formatString.replace(/2+/, day);
    }
    if (hour) {
        formatString = formatString.replace(/0+/, hour);
    }
    if (minute) {
        formatString = formatString.replace(/3+/, minute);
    }
    if (second) {
        formatString = formatString.replace(/4+/, second);
    }

    return formatString;
}