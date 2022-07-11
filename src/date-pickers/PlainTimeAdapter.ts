import { Unit } from "@date-io/core/IUtils";
import { Temporal } from "@js-temporal/polyfill";
import {MuiPickersAdapter} from "@mui/x-date-pickers/internals";
import {DateTimeFormat, Now, PlainTime} from "../temporal";
import {parsePlainTime} from "./parse";
import {durationToUnit, TemporalAdapter} from "./TemporalAdapter";

export class PlainTimeAdapter extends TemporalAdapter<PlainTime> implements MuiPickersAdapter<PlainTime> {
    lib = "PlainTimeAdapter";

    date(value?: any): PlainTime | null {
        if (value === null) {
            return null;
        }
        if (value === undefined) {
            return Now.plainTimeISO();
        }

        if (value instanceof PlainTime) {
            return value;
        }

        if (typeof value === "string") {
            try {
                return PlainTime.from(value, {overflow: "reject"});
            }
            catch (error) {
                return this.parse(value, this.formats.fullTime);
            }
        }

        console.error("Unexpected value", value);
        return null;
    }

    toJsDate(value: PlainTime): Date {
        const date = new Date();
        date.setHours(value.hour, value.minute, value.second, value.millisecond);
        return date;
    }

    parseISO(isString: string): PlainTime {
        return PlainTime.from(isString);
    }

    parse(value: string, format: string | DateTimeFormat): PlainTime | null {
        try {
            return parsePlainTime(value, format as any as DateTimeFormat);
        }
        catch (error) {
            console.warn("Could not parse", {value, format});
        }
        return null;
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

    isSameHour(value: PlainTime, comparing: PlainTime): boolean {
        return value.hour == comparing.hour;
    }

    startOfDay(value: PlainTime): PlainTime {
        return new PlainTime();
    }

    endOfDay(value: PlainTime): PlainTime {
        return new PlainTime();
    }

    getHours(value: PlainTime): number {
        return value.hour;
    }

    setHours(value: PlainTime, count: number): PlainTime {
        return value.with({hour: count});
    }

    getMinutes(value: PlainTime): number {
        return value.minute;
    }

    setMinutes(value: PlainTime, count: number): PlainTime {
        return value.with({minute: count});
    }

    getSeconds(value: PlainTime): number {
        return value.second;
    }

    setSeconds(value: PlainTime, count: number): PlainTime {
        return value.with({second: count});
    }

    setMonth(value: PlainTime, count: number): PlainTime {
        return value;
    }

    setYear(value: PlainTime, count: number): PlainTime {
        return value;
    }

    mergeDateAndTime(date: PlainTime, time: PlainTime): PlainTime {
        return time;
    }

    addSeconds(value: PlainTime, count: number): PlainTime {
        return value.add({seconds: count});
    }

    addMinutes(value: PlainTime, count: number): PlainTime {
        return value.add({minutes: count});
    }

    addHours(value: PlainTime, count: number): PlainTime {
        return value.add({hours: count});
    }

    addDays(value: PlainTime, count: number): PlainTime {
        return value.add({days: count});
    }

    addWeeks(value: PlainTime, count: number): PlainTime {
        return value.add({weeks: count});
    }

    addMonths(value: PlainTime, count: number): PlainTime {
        return value.add({months: count});
    }

    getDiff(value: PlainTime, comparing: string | Temporal.PlainTime, unit?: Unit | undefined): number {
        return durationToUnit(value.until(comparing), unit);
    }

    isSameDay(value: PlainTime, comparing: PlainTime): boolean {
        return true;
    }

    isSameMonth(value: Temporal.PlainTime, comparing: Temporal.PlainTime): boolean {
        return true;
    }

    isSameYear(value: Temporal.PlainTime, comparing: Temporal.PlainTime): boolean {
        return true;
    }

    isAfter(value: Temporal.PlainTime, comparing: Temporal.PlainTime): boolean {
        return PlainTime.compare(value, comparing) > 0;
    }

    isAfterDay(value: Temporal.PlainTime, comparing: Temporal.PlainTime): boolean {
        return false;
    }

    isAfterYear(value: Temporal.PlainTime, comparing: Temporal.PlainTime): boolean {
        return false;
    }

    isBeforeDay(value: Temporal.PlainTime, comparing: Temporal.PlainTime): boolean {
        return false;
    }

    isBeforeYear(value: Temporal.PlainTime, comparing: Temporal.PlainTime): boolean {
        return false;
    }

    isBefore(value: Temporal.PlainTime, comparing: Temporal.PlainTime): boolean {
        return PlainTime.compare(value, comparing) < 0;
    }

    isWithinRange(value: Temporal.PlainTime, [start, end]: [Temporal.PlainTime, Temporal.PlainTime]): boolean {
        return PlainTime.compare(value, start) > 0 && PlainTime.compare(value, end) < 0;
    }

    startOfYear(value: Temporal.PlainTime): Temporal.PlainTime {
        return value;
    }

    endOfYear(value: Temporal.PlainTime): Temporal.PlainTime {
        return value;
    }

    startOfMonth(value: Temporal.PlainTime): Temporal.PlainTime {
        return value;
    }

    endOfMonth(value: Temporal.PlainTime): Temporal.PlainTime {
        return value;
    }

    startOfWeek(value: Temporal.PlainTime): Temporal.PlainTime {
        return value;
    }

    endOfWeek(value: Temporal.PlainTime): Temporal.PlainTime {
        return value;
    }

    getMonth(value: Temporal.PlainTime): number {
        return 1;
    }

    getDaysInMonth(value: Temporal.PlainTime): number {
        return 30;
    }

    getNextMonth(value: Temporal.PlainTime): Temporal.PlainTime {
        return value;
    }

    getPreviousMonth(value: Temporal.PlainTime): Temporal.PlainTime {
        return value;
    }

    getMonthArray(value: Temporal.PlainTime): Temporal.PlainTime[] {
        throw new Error("Method not implemented.");
    }

    getYear(value: Temporal.PlainTime): number {
        throw new Error("Method not implemented.");
    }

    getWeekdays(): string[] {
        throw new Error("Method not implemented.");
    }

    getWeekArray(date: Temporal.PlainTime): Temporal.PlainTime[][] {
        throw new Error("Method not implemented.");
    }

    getYearRange(start: Temporal.PlainTime, end: Temporal.PlainTime): Temporal.PlainTime[] {
        throw new Error("Method not implemented.");
    }
}
