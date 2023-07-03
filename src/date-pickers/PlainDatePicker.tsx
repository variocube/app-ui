import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import * as React from "react";
import {PlainDate} from "../temporal";
import {PlainDateAdapter} from "./PlainDateAdapter";
import {useRenderInput, UseRenderInputProps} from "./useRenderInput";
import {useLocale} from "./useLocale";

interface PlainDatePickerProps {
    value: PlainDate | null;
    onChange: (value: PlainDate | null) => any;
    label?: string;
    disabled?: boolean;
    required?: boolean;

    /**
     * Allows overriding the locale. Only use for testing.
     */
    locale?: string;
}

export function PlainDatePicker(props: PlainDatePickerProps & UseRenderInputProps) {

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
        <LocalizationProvider dateAdapter={PlainDateAdapter} adapterLocale={locale}>
            <DatePicker
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

