import {MuiPickersAdapter} from "@mui/x-date-pickers/internals";
import {DateTimeFormat, Now, PlainDateTime} from "../temporal";
import {parsePlainDateTime} from "./parse";
import {PlainAdapterCommon} from "./PlainAdapterCommon";

export class PlainDateTimeAdapter extends PlainAdapterCommon<PlainDateTime> implements MuiPickersAdapter<PlainDateTime> {
    lib = "PlainDateTimeAdapter";

    date(value?: any): PlainDateTime | null {
        if (value === null) {
            return null;
        }
        if (value === undefined) {
            return Now.plainDateTimeISO();
        }

        if (value instanceof PlainDateTime) {
            return value;
        }

        if (typeof value === "string") {
            try {
                return PlainDateTime.from(value, {overflow: "reject"});
            }
            catch (error) {
                return this.parse(value, this.formats.shortDate);
            }
        }

        console.error("Unexpected value", value);
        return null;
    }

    toJsDate(value: PlainDateTime): Date {
        return new Date(value.year, value.month-1, value.day, value.hour, value.minute, value.second, value.millisecond);
    }

    parseISO(isString: string): PlainDateTime {
        return PlainDateTime.from(isString);
    }

    parse(value: string, format: string | DateTimeFormat): PlainDateTime | null {
        try {
            return parsePlainDateTime(value, format as any as DateTimeFormat);
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

    isSameHour(value: PlainDateTime, comparing: PlainDateTime): boolean {
        return this.isSameDay(value, comparing) && value.hour == comparing.hour;
    }

    startOfDay(value: PlainDateTime): PlainDateTime {
        return value.toPlainDate().toPlainDateTime({hour: 0});
    }

    endOfDay(value: PlainDateTime): PlainDateTime {
        return value.toPlainDate().toPlainDateTime({hour: 23, minute: 59, second: 59});
    }

    getHours(value: PlainDateTime): number {
        return value.hour;
    }

    setHours(value: PlainDateTime, count: number): PlainDateTime {
        return value.with({hour: count});
    }

    getMinutes(value: PlainDateTime): number {
        return value.minute;
    }

    setMinutes(value: PlainDateTime, count: number): PlainDateTime {
        return value.with({minute: count});
    }

    getSeconds(value: PlainDateTime): number {
        return value.second;
    }

    setSeconds(value: PlainDateTime, count: number): PlainDateTime {
        return value.with({second: count});
    }

    setMonth(value: PlainDateTime, count: number): PlainDateTime {
        return value.with({month: count});
    }

    setYear(value: PlainDateTime, count: number): PlainDateTime {
        return value.with({year: count});
    }

    mergeDateAndTime(date: PlainDateTime, time: PlainDateTime): PlainDateTime {
        return date.toPlainDate().toPlainDateTime(time);
    }

    addSeconds(value: PlainDateTime, count: number): PlainDateTime {
        return value.add({seconds: count});
    }

    addMinutes(value: PlainDateTime, count: number): PlainDateTime {
        return value.add({minutes: count});
    }

    addHours(value: PlainDateTime, count: number): PlainDateTime {
        return value.add({hours: count});
    }

    addDays(value: PlainDateTime, count: number): PlainDateTime {
        return value.add({days: count});
    }

    addWeeks(value: PlainDateTime, count: number): PlainDateTime {
        return value.add({weeks: count});
    }

    addMonths(value: PlainDateTime, count: number): PlainDateTime {
        return value.add({months: count});
    }

}
