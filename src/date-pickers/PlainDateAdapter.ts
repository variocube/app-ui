import {MuiPickersAdapter} from "@mui/x-date-pickers/internals";
import {DateTimeFormat, Now, PlainDate} from "../temporal";
import {parsePlainDate} from "./parse";
import {DateIOFormats, Unit} from "@date-io/core/IUtils";
import {getFormatString} from "./getFormatString";

export class PlainDateAdapter implements MuiPickersAdapter<PlainDate> {
    lib = "PlainDateAdapter";
    formats: Record<keyof DateIOFormats, DateTimeFormat>;

    constructor({locale = "default"}) {
        this.formats = createFormats(locale);
    }

    date(value?: any): PlainDate | null {
        if (value === null) {
            return null;
        }
        if (value === undefined) {
            return Now.plainDate("gregory");
        }

        if (value instanceof PlainDate) {
            return value;
        }

        if (typeof value === "string") {
            try {
                return PlainDate.from(value, {overflow: "reject"});
            }
            catch (error) {
                return this.parse(value, this.formats.shortDate);
            }
        }

        console.error("Unexpected value", value);
        return null;
    }

    toJsDate(value: PlainDate): Date {
        return new Date(value.year, value.month-1, value.day);
    }

    parseISO(isString: string): PlainDate {
        return PlainDate.from(isString);
    }

    toISO(value: PlainDate): string {
        return value.toString();
    }

    parse(value: string, format: string | DateTimeFormat): PlainDate | null {
        try {
            return parsePlainDate(value, format as any as DateTimeFormat);
        }
        catch (error) {
            console.warn("Could not parse", {value, format});
        }
        return null;
    }

    getCurrentLocaleCode(): string {
        return this.formats.fullDate.resolvedOptions().locale;
    }

    is12HourCycleInCurrentLocale(): boolean {
        return this.formats.fullTime.resolvedOptions().hour12 ?? false;
    }

    getFormatHelperText(format: string | DateTimeFormat): string {
        return getFormatString(format as DateTimeFormat, {year: "YYYY", month: "MM", day: "DD"});
    }

    isNull(value: PlainDate | null): boolean {
        return Boolean(value);
    }

    isValid(value: any): boolean {
        return this.date(value) != null;
    }

    isEqual(value: any, comparing: any): boolean {
        const first = this.date(value);
        const second = this.date(comparing);
        if (first === second) {
            return true;
        }
        if (!first || !second) {
            return false;
        }
        return first.equals(second);
    }

    isSameDay(value: PlainDate, comparing: PlainDate): boolean {
        return value.equals(comparing);
    }

    isSameMonth(value: PlainDate, comparing: PlainDate): boolean {
        return value.toPlainYearMonth().equals(comparing.toPlainYearMonth());
    }

    isSameYear(value: PlainDate, comparing: PlainDate): boolean {
        return value.year == comparing.year;
    }

    isSameHour(value: PlainDate, comparing: PlainDate): boolean {
        return true;
    }

    isAfter(value: PlainDate, comparing: PlainDate): boolean {
        return PlainDate.compare(value, comparing) > 0;
    }

    isAfterDay(value: PlainDate, comparing: PlainDate): boolean {
        return this.isAfter(value, comparing);
    }

    isAfterYear(value: PlainDate, comparing: PlainDate): boolean {
        return value.year > comparing.year;
    }

    isBeforeDay(value: PlainDate, comparing: PlainDate): boolean {
        return this.isBefore(value, comparing);
    }

    isBeforeYear(value: PlainDate, comparing: PlainDate): boolean {
        return value.year < comparing.year;
    }

    isBefore(value: PlainDate, comparing: PlainDate): boolean {
        return PlainDate.compare(value, comparing) < 0;
    }

    isWithinRange(value: PlainDate, [start, end]: [PlainDate, PlainDate]): boolean {
        return !this.isBefore(value, start) && !this.isAfter(value, end);
    }

    startOfYear(value: PlainDate): PlainDate {
        return value.with({day: 1, month: 1});
    }

    endOfYear(value: PlainDate): PlainDate {
        return value.with({day: 31, month: 12});
    }

    startOfMonth(value: PlainDate): PlainDate {
        return value.with({day: 1});
    }

    endOfMonth(value: PlainDate): PlainDate {
        return value.add({months: 1})
            .with({day: 1})
            .subtract({days: 1});
    }

    startOfWeek(value: PlainDate): PlainDate {
        return value.subtract({days: value.dayOfWeek - 1});
    }

    endOfWeek(value: PlainDate): PlainDate {
        return value.add({days: 7 - value.dayOfWeek});
    }

    addSeconds(value: PlainDate, count: number): PlainDate {
        return value.add({seconds: count});
    }

    addMinutes(value: PlainDate, count: number): PlainDate {
        return value.add({minutes: count});
    }

    addHours(value: PlainDate, count: number): PlainDate {
        return value.add({hours: count});
    }

    addDays(value: PlainDate, count: number): PlainDate {
        return value.add({days: count});
    }

    addWeeks(value: PlainDate, count: number): PlainDate {
        return value.add({weeks: count});
    }

    addMonths(value: PlainDate, count: number): PlainDate {
        return value.add({months: count});
    }

    startOfDay(value: PlainDate): PlainDate {
        return value;
    }

    endOfDay(value: PlainDate): PlainDate {
        return value;
    }

    formatByString(value: PlainDate, format: string | DateTimeFormat): string {
        return (format as DateTimeFormat).format(value);
    }

    formatNumber(numberToFormat: string): string {
        return numberToFormat;
    }

    getHours(value: PlainDate): number {
        return 0;
    }

    setHours(value: PlainDate, count: number): PlainDate {
        return value;
    }

    getMinutes(value: PlainDate): number {
        return 0;
    }

    setMinutes(value: PlainDate, count: number): PlainDate {
        return value;
    }

    getSeconds(value: PlainDate): number {
        return 0;
    }

    setSeconds(value: PlainDate, count: number): PlainDate {
        return value;
    }

    getMonth(value: PlainDate): number {
        return value.month;
    }

    getDaysInMonth(value: PlainDate): number {
        return value.daysInMonth;
    }

    setMonth(value: PlainDate, count: number): PlainDate {
        return value.with({month: count});
    }

    getNextMonth(value: PlainDate): PlainDate {
        return value.add({months: 1});
    }

    getPreviousMonth(value: PlainDate): PlainDate {
        return value.subtract({months: 1});
    }

    getMonthArray(value: PlainDate): PlainDate[] {
        return [...Array(12).keys()]
            .map(index => value.with({day: 1, month: index + 1}));
    }

    getYear(value: PlainDate): number {
        return value.year;
    }

    setYear(value: PlainDate, count: number): PlainDate {
        return value.with({year: count});
    }

    mergeDateAndTime(date: PlainDate, time: PlainDate): PlainDate {
        return date;
    }

    getWeekdays(): string[] {
        const startOfWeek = this.startOfWeek(Now.plainDate("gregory"));
        return [...Array(7).keys()]
            .map(index => this.formats.weekday.format(startOfWeek.add({days: index})));
    }

    getWeekArray(date: PlainDate): PlainDate[][] {
        const start = this.startOfWeek(this.startOfMonth(date));
        const end = this.endOfWeek(this.endOfMonth(date));
        const weeks = (start.until(end).total("days") + 1) / 7;
        return [...Array(weeks).keys()].map(weekIndex => {
            const weekStart = start.add({weeks: weekIndex});
            return [...Array(7).keys()]
                .map(index => weekStart.add({days: index}));
        });
    }

    getYearRange(start: PlainDate, end: PlainDate): PlainDate[] {
        return [...Array(end.year - start.year).keys()]
            .map(yearIndex => start.add({years: yearIndex}));
    }

    getMeridiemText(ampm: "am" | "pm"): string {
        return ampm.toUpperCase();
    }

    getDiff(value: PlainDate, comparing: PlainDate | string, unit?: Unit) {
        const diff = value.until(comparing);
        return unit == "quarters"
            ? Math.floor(diff.total("months") / 4)
            : diff.total(unit || "milliseconds");
    }

    format(value: PlainDate, formatKey: keyof DateIOFormats) {
        return this.formats[formatKey].format(value);
    }
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