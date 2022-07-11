import {DateTimeFormat, Duration, PlainDate, PlainDateTime, PlainTime} from "../temporal";
import {DateIOFormats, Unit} from "@date-io/core/IUtils";
import {getFormatString} from "./getFormatString";

export class TemporalAdapter<T extends PlainDate | PlainDateTime | PlainTime> {
    formats: Record<keyof DateIOFormats, DateTimeFormat>;

    constructor({locale = "default"}) {
        this.formats = createFormats(locale);
    }

    getCurrentLocaleCode(): string {
        return this.formats.fullDate.resolvedOptions().locale;
    }

    is12HourCycleInCurrentLocale(): boolean {
        return this.formats.fullTime.resolvedOptions().hour12 ?? false;
    }

    getFormatHelperText(format: string | DateTimeFormat): string {
        return getFormatString(format as DateTimeFormat, {
            year: "YYYY",
            month: "MM",
            day: "DD",
            hour: "HH",
            minute: "MM",
            second: "SS"
        });
    }

    isNull(value: T | null): boolean {
        return Boolean(value);
    }

    toISO(value: T): string {
        return value.toString();
    }

    format(value: T, formatKey: keyof DateIOFormats) {
        return this.formats[formatKey].format(value);
    }

    formatByString(value: T, format: string | DateTimeFormat): string {
        return (format as DateTimeFormat).format(value);
    }

    formatNumber(numberToFormat: string): string {
        return numberToFormat;
    }

    getMeridiemText(ampm: "am" | "pm"): string {
        return ampm.toUpperCase();
    }
}

export function durationToUnit(duration: Duration, unit?: Unit) {
    return unit == "quarters"
        ? Math.floor(duration.total("months") / 4)
        : duration.total(unit || "milliseconds");
}

function createFormats(locale = "default") {
    const entries = Object.entries(FORMAT_OPTIONS)
        .map(([key, options]) => [key, new DateTimeFormat(locale, options)] as const);
    return Object.fromEntries(entries) as Record<keyof DateIOFormats<DateTimeFormat>, DateTimeFormat>;
}

const FORMAT_OPTIONS = {
    /** Localized full date @example "Jan 1, 2019" */
    fullDate: {dateStyle: "medium"},

    /** Partially localized full date with weekday, useful for text-to-speech accessibility @example "Tuesday, January 1, 2019" */
    fullDateWithWeekday: {dateStyle: "full"},

    /** Date format string with month and day of month @example "1 January" */
    normalDate: {day: "numeric", month: "long"},

    /** Date format string with weekday, month and day of month @example "Wed, Jan 1" */
    normalDateWithWeekday: {day: "numeric", month: "long", weekday: "short"},

    /** Shorter day format @example "Jan 1" */
    shortDate: {day: "numeric", month: "short"},

    /** Year format string @example "2019" */
    year: {year: "numeric"},

    /** Month format string @example "January" */
    month: {month: "long"},

    /** Short month format string @example "Jan" */
    monthShort: {month: "short"},

    /** Month with year format string @example "January 2018" */
    monthAndYear: {month: "long", year: "numeric"},

    /** Month with date format string @example "January 1" */
    monthAndDate: {day: "numeric", month: "long"},

    /** Weekday format string @example "Wednesday" */
    weekday: {weekday: "long"},

    /** Short weekday format string @example "Wed" */
    weekdayShort: {weekday: "short"},

    /** Day format string @example "1" */
    dayOfMonth: {day: "numeric"},

    /** Hours format string @example "11" */
    hours12h: {hour: "numeric", hour12: true},

    /** Hours format string @example "23" */
    hours24h: {hour: "numeric"},

    /** Minutes format string @example "44" */
    minutes: {minute: "2-digit"},

    /** Seconds format string @example "00" */
    seconds: {second: "2-digit"},

    /** Full time localized format string @example "11:44 PM" for US, "23:44" for Europe */
    fullTime: {timeStyle: "short"},

    /** Not localized full time format string @example "11:44 PM" */
    fullTime12h: {timeStyle: "short"},

    /** Not localized full time format string @example "23:44" */
    fullTime24h: {timeStyle: "short"},

    /** Date & time format string with localized time @example "Jan 1, 2018 11:44 PM" */
    fullDateTime: {dateStyle: "medium", timeStyle: "short"},

    /** Not localized date & Time format 12h @example "Jan 1, 2018 11:44 PM" */
    fullDateTime12h: {dateStyle: "medium", timeStyle: "short"},

    /** Not localized date & Time format 24h @example "Jan 1, 2018 23:44" */
    fullDateTime24h: {dateStyle: "medium", timeStyle: "short"},

    /** Localized keyboard input friendly date format @example "02/13/2020 */
    keyboardDate: {year: "numeric", month: "2-digit", day: "2-digit"},

    /** Localized keyboard input friendly date/time format @example "02/13/2020 23:44" */
    keyboardDateTime: {year: "numeric", month: "2-digit", day: "2-digit", hour: "numeric", minute: "numeric"},

    /** Partially localized keyboard input friendly date/time 12h format @example "02/13/2020 11:44 PM" */
    keyboardDateTime12h: {year: "numeric", month: "2-digit", day: "2-digit", hour: "numeric", minute: "numeric"},

    /** Partially localized keyboard input friendly date/time 24h format @example "02/13/2020 23:44" */
    keyboardDateTime24h: {year: "numeric", month: "2-digit", day: "2-digit", hour: "numeric", minute: "numeric"},

} as const;