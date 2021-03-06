import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import * as React from "react";
import {PlainDate} from "../temporal";
import {PlainDateAdapter} from "./PlainDateAdapter";
import {useRenderInput} from "./useRenderInput";
import {useLocale} from "./useLocale";

interface PlainDatePickerProps {
    value: PlainDate | null;
    onChange: (value: PlainDate | null) => any;
    label?: string;
    fullWidth?: boolean;

    /**
     * Allows overriding the locale. Only use for testing.
     */
    locale?: string;
}

export function PlainDatePicker(props: PlainDatePickerProps) {

    const {value, onChange, label, fullWidth, locale: suppliedLocale} = props;

    const locale = useLocale(suppliedLocale);
    const renderInput = useRenderInput(fullWidth);

    return (
        <LocalizationProvider dateAdapter={PlainDateAdapter} adapterLocale={locale}>
            <DatePicker
                label={label}
                value={value}
                disableMaskedInput
                onChange={onChange}
                renderInput={renderInput}
            />
        </LocalizationProvider>
    );
}

