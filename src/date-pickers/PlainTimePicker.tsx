import {PlainTime} from "../temporal";
import {useLocale} from "./useLocale";
import {useRenderInput, UseRenderInputProps} from "./useRenderInput";
import {LocalizationProvider, TimePicker} from "@mui/x-date-pickers";
import * as React from "react";
import {PlainTimeAdapter} from "./PlainTimeAdapter";

interface PlainTimePickerProps {
    value: PlainTime | null;
    onChange: (value: PlainTime | null) => any;
    label?: string;
    disabled?: boolean;
    required?: boolean;

    /**
     * Allows overriding the locale. Only use for testing.
     */
    locale?: string;
}

export function PlainTimePicker(props: PlainTimePickerProps & UseRenderInputProps) {
    const {
        value,
        onChange, label,
        locale: suppliedLocale,
        disabled,
        ...renderInputProps
    } = props;

    const locale = useLocale(suppliedLocale);
    const renderInput = useRenderInput(renderInputProps);

    return (
        <LocalizationProvider dateAdapter={PlainTimeAdapter} adapterLocale={locale}>
            <TimePicker
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