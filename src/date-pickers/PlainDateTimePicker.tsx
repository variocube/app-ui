import {PlainDateTime} from "../temporal";
import {useLocale} from "./useLocale";
import {useRenderInput} from "./useRenderInput";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import * as React from "react";
import {PlainDateTimeAdapter} from "./PlainDateTimeAdapter";

interface PlainDateTimePickerProps {
    value: PlainDateTime | null;
    onChange: (value: PlainDateTime | null) => any;
    label?: string;
    fullWidth?: boolean;

    /**
     * Allows overriding the locale. Only use for testing.
     */
    locale?: string;
}
export function PlainDateTimePicker(props: PlainDateTimePickerProps) {
    const {value, onChange, label, fullWidth, locale: suppliedLocale} = props;

    const locale = useLocale(suppliedLocale);
    const renderInput = useRenderInput(fullWidth);

    return (
        <LocalizationProvider dateAdapter={PlainDateTimeAdapter} adapterLocale={locale}>
            <DateTimePicker
                label={label}
                value={value}
                disableMaskedInput
                onChange={onChange}
                renderInput={renderInput}
            />
        </LocalizationProvider>
    );
}