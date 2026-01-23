import {MuiPickersAdapter} from "@mui/x-date-pickers/internals";
import {DateTimeFormat, Now, PlainDate} from "../temporal";
import {parsePlainDate} from "./parse";
import {PlainAdapterCommon} from "./PlainAdapterCommon";

export class PlainDateAdapter extends PlainAdapterCommon<PlainDate> implements MuiPickersAdapter<PlainDate> {
	lib = "PlainDateAdapter";

	date(value?: any): PlainDate | null {
		if (value === null) {
			return null;
		}
		if (value === undefined) {
			return Now.plainDateISO();
		}

		if (value instanceof PlainDate) {
			return value;
		}

		if (typeof value === "string") {
			try {
				return PlainDate.from(value, {overflow: "reject"});
			} catch (error) {
				return this.parse(value, this.formats.shortDate);
			}
		}

		console.error("Unexpected value", value);
		return null;
	}

	toJsDate(value: PlainDate): Date {
		return new Date(value.year, value.month - 1, value.day);
	}

	parseISO(isString: string): PlainDate {
		return PlainDate.from(isString);
	}

	parse(value: string, format: string | DateTimeFormat): PlainDate | null {
		try {
			return parsePlainDate(value, format as any as DateTimeFormat);
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

	isSameHour(value: PlainDate, comparing: PlainDate): boolean {
		return true;
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

	setMonth(value: PlainDate, count: number): PlainDate {
		return value.with({month: count});
	}

	setYear(value: PlainDate, count: number): PlainDate {
		return value.with({year: count});
	}

	mergeDateAndTime(date: PlainDate, time: PlainDate): PlainDate {
		return date;
	}
}
