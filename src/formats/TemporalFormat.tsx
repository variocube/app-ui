import {Formattable} from "../temporal";
import {useDateTimeFormat} from "./useDateTimeFormat";
import * as React from "react";
import {Fragment, useMemo} from "react";
import {DateStyle, TimeStyle} from "./types";

export interface TemporalFormatProps {
    /**
     * The date value to format.
     */
    value: Formattable | null | undefined;

    /**
     * The style of the date format.
     */
    dateStyle?: DateStyle | undefined;

    /**
     * The style of the time format.
     */
    timeStyle?: TimeStyle | undefined;

    /**
     * Overrides the user's locale. Use for testing only.
     */
    locale?: string;

    /**
     * Overrides the user's time zone. Use for testing only.
     */
    timeZone?: string;
}

export function TemporalFormat(props: TemporalFormatProps) {
    const {
        value,
        dateStyle,
        timeStyle,
        locale,
        timeZone,
    } = props;

    const options = useMemo(() => ({
        dateStyle,
        timeStyle,
        timeZone,
    }), [dateStyle, timeStyle]);

    const dateTimeFormat = useDateTimeFormat(options, locale);

    const str = useMemo(() => {
        return value != null ? dateTimeFormat.format(value) : "";
    }, [dateTimeFormat, value]);

    return <Fragment>{str}</Fragment>;
}