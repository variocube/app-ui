import {PlainTime} from "../temporal";
import {useLocale} from "./useLocale";
import {useRenderInput} from "./useRenderInput";
import {LocalizationProvider, TimePicker} from "@mui/x-date-pickers";
import * as React from "react";
import {PlainTimeAdapter} from "./PlainTimeAdapter";

interface PlainTimePickerProps {
    value: PlainTime | null;
    onChange: (value: PlainTime | null) => any;
    label?: string;
    fullWidth?: boolean;

    /**
     * Allows overriding the locale. Only use for testing.
     */
    locale?: string;
}

export function PlainTimePicker(props: PlainTimePickerProps) {
    const {value, onChange, label, fullWidth, locale: suppliedLocale} = props;

    const locale = useLocale(suppliedLocale);
    const renderInput = useRenderInput(fullWidth);


    return (
        <LocalizationProvider dateAdapter={PlainTimeAdapter} adapterLocale={locale}>
            <TimePicker
                label={label}
                value={value}
                disableMaskedInput
                onChange={onChange}
                renderInput={renderInput}
            />
        </LocalizationProvider>
    );
}