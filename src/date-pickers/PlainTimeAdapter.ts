import {Unit} from "@date-io/core/IUtils";
import {MuiPickersAdapter} from "@mui/x-date-pickers/internals";
import {DateTimeFormat, Now, PlainTime} from "../temporal";
import {parsePlainTime} from "./parse";
import {durationToUnit, isCalendarUnit, TemporalAdapter} from "./TemporalAdapter";

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
			} catch (error) {
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
		} catch (error) {
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

	getDiff(value: PlainTime, comparing: string | PlainTime, unit?: Unit | undefined): number {
		// Two times of day are less than a day apart, and calendar units can't be computed without a date.
		return isCalendarUnit(unit) ? 0 : durationToUnit(value.until(comparing), unit);
	}

	isSameDay(value: PlainTime, comparing: PlainTime): boolean {
		return true;
	}

	isSameMonth(value: PlainTime, comparing: PlainTime): boolean {
		return true;
	}

	isSameYear(value: PlainTime, comparing: PlainTime): boolean {
		return true;
	}

	isAfter(value: PlainTime, comparing: PlainTime): boolean {
		return PlainTime.compare(value, comparing) > 0;
	}

	isAfterDay(value: PlainTime, comparing: PlainTime): boolean {
		return false;
	}

	isAfterYear(value: PlainTime, comparing: PlainTime): boolean {
		return false;
	}

	isBeforeDay(value: PlainTime, comparing: PlainTime): boolean {
		return false;
	}

	isBeforeYear(value: PlainTime, comparing: PlainTime): boolean {
		return false;
	}

	isBefore(value: PlainTime, comparing: PlainTime): boolean {
		return PlainTime.compare(value, comparing) < 0;
	}

	isWithinRange(value: PlainTime, [start, end]: [PlainTime, PlainTime]): boolean {
		return PlainTime.compare(value, start) > 0 && PlainTime.compare(value, end) < 0;
	}

	startOfYear(value: PlainTime): PlainTime {
		return value;
	}

	endOfYear(value: PlainTime): PlainTime {
		return value;
	}

	startOfMonth(value: PlainTime): PlainTime {
		return value;
	}

	endOfMonth(value: PlainTime): PlainTime {
		return value;
	}

	startOfWeek(value: PlainTime): PlainTime {
		return value;
	}

	endOfWeek(value: PlainTime): PlainTime {
		return value;
	}

	getMonth(value: PlainTime): number {
		return 1;
	}

	getDaysInMonth(value: PlainTime): number {
		return 30;
	}

	getNextMonth(value: PlainTime): PlainTime {
		return value;
	}

	getPreviousMonth(value: PlainTime): PlainTime {
		return value;
	}

	getMonthArray(value: PlainTime): PlainTime[] {
		throw new Error("Method not implemented.");
	}

	getYear(value: PlainTime): number {
		throw new Error("Method not implemented.");
	}

	getWeekdays(): string[] {
		throw new Error("Method not implemented.");
	}

	getWeekArray(date: PlainTime): PlainTime[][] {
		throw new Error("Method not implemented.");
	}

	getYearRange(start: PlainTime, end: PlainTime): PlainTime[] {
		throw new Error("Method not implemented.");
	}
}
