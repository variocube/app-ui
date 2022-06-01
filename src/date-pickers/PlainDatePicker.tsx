import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import * as React from "react";
import {useCallback, useMemo} from "react";
import {PlainDate} from "../temporal";
import {TextField} from "@mui/material";
import {TextFieldProps} from "@mui/material/TextField/TextField";
import {PlainDateAdapter} from "./PlainDateAdapter";
import {findSupportedLocale} from "./findSupportedLocale";

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

    const locale = useMemo(() => suppliedLocale || findSupportedLocale(), [suppliedLocale]);

    const renderInput = useCallback((props: TextFieldProps) => (
        <TextField variant="outlined" fullWidth={fullWidth} {...props}/>
    ), [fullWidth]);

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

