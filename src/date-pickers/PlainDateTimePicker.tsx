import {PlainDateTime} from "../temporal";
import {useLocale} from "./useLocale";
import {useRenderInput, UseRenderInputProps} from "./useRenderInput";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import * as React from "react";
import {PlainDateTimeAdapter} from "./PlainDateTimeAdapter";

interface PlainDateTimePickerProps {
    value: PlainDateTime | null;
    onChange: (value: PlainDateTime | null) => any;
    label?: string;
    disabled?: boolean;

    /**
     * Allows overriding the locale. Only use for testing.
     */
    locale?: string;
}
export function PlainDateTimePicker(props: PlainDateTimePickerProps & UseRenderInputProps) {
    const {
        value,
        onChange,
        label,
        disabled,
        locale: suppliedLocale,
        ...renderInputProps
    } = props;

    const locale = useLocale(suppliedLocale);
    const renderInput = useRenderInput(renderInputProps);

    return (
        <LocalizationProvider dateAdapter={PlainDateTimeAdapter} adapterLocale={locale}>
            <DateTimePicker
                label={label}
                value={value}
                disableMaskedInput
                onChange={onChange}
                disabled={disabled}
                renderInput={renderInput}
            />
        </LocalizationProvider>
    );
}