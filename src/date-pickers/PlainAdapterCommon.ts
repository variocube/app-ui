import {Now, PlainDate, PlainDateTime} from "../temporal";
import {Unit} from "@date-io/core/IUtils";
import {durationToUnit, TemporalAdapter} from "./TemporalAdapter";

export class PlainAdapterCommon<T extends PlainDate | PlainDateTime> extends TemporalAdapter<T> {

    startOfYear(value: T): T {
        return value.with({day: 1, month: 1}) as T;
    }

    endOfYear(value: T): T {
        return value.with({day: 31, month: 12}) as T;
    }

    startOfMonth(value: T): T {
        return value.with({day: 1}) as T;
    }

    endOfMonth(value: T): T {
        return value.add({months: 1})
            .with({day: 1})
            .subtract({days: 1}) as T;
    }

    startOfWeek(value: T): T {
        return value.subtract({days: value.dayOfWeek - 1}) as T;
    }

    endOfWeek(value: T): T {
        return value.add({days: 7 - value.dayOfWeek}) as T;
    }

    getNextMonth(value: T): T {
        return value.add({months: 1}) as T;
    }

    getPreviousMonth(value: T): T {
        return value.subtract({months: 1}) as T;
    }

    isBefore(value: T, comparing: T): boolean {
        return PlainDateTime.compare(value, comparing) < 0;
    }

    isAfter(value: T, comparing: T): boolean {
        return PlainDateTime.compare(value, comparing) > 0;
    }

    isSameDay(value: T, comparing: T): boolean {
        return PlainDate.compare(value, comparing) == 0;
    }

    isSameMonth(value: T, comparing: T): boolean {
        return value.toPlainYearMonth().equals(comparing.toPlainYearMonth());
    }

    isSameYear(value: T, comparing: T): boolean {
        return value.year == comparing.year;
    }

    isWithinRange(value: T, [start, end]: [T, T]): boolean {
        return !this.isBefore(value, start) && !this.isAfter(value, end);
    }

    isBeforeDay(value: T, comparing: T): boolean {
        return PlainDate.compare(value, comparing) < 0;
    }

    isAfterDay(value: T, comparing: T): boolean {
        return PlainDate.compare(value, comparing) > 0;
    }

    isBeforeYear(value: T, comparing: T): boolean {
        return value.year < comparing.year;
    }

    isAfterYear(value: T, comparing: T): boolean {
        return value.year > comparing.year;
    }

    getMonth(value: T): number {
        return value.month;
    }

    getDaysInMonth(value: T): number {
        return value.daysInMonth;
    }

    getYear(value: T): number {
        return value.year;
    }

    getWeekdays(): string[] {
        const today = Now.plainDateISO();
        const startOfWeek = today.subtract({days: today.dayOfWeek - 1});
        return [...Array(7).keys()]
            .map(index => this.formats.weekday.format(startOfWeek.add({days: index})));
    }

    getMonthArray(value: T): T[] {
        return [...Array(12).keys()]
            .map(index => value.with({day: 1, month: index + 1}) as T);
    }

    getWeekArray(date: T): T[][] {
        const start = this.startOfWeek(this.startOfMonth(date));
        const end = this.endOfWeek(this.endOfMonth(date));
        const weeks = (start.until(end).total("days") + 1) / 7;
        return [...Array(weeks).keys()].map(weekIndex => {
            const weekStart = start.add({weeks: weekIndex});
            return [...Array(7).keys()]
                .map(index => weekStart.add({days: index}) as T);
        });
    }

    getYearRange(start: T, end: T): T[] {
        return [...Array(end.year - start.year).keys()]
            .map(yearIndex => start.add({years: yearIndex}) as T);
    }

    getDiff(value: T, comparing: T | string, unit?: Unit) {
        return durationToUnit(value.until(comparing), unit);
    }
}

