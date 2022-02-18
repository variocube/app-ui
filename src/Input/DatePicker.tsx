import DateAdapter from "@mui/lab/AdapterLuxon";
import {DatePicker as DP} from "@mui/lab";
import {TextField} from "@mui/material";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import React from "react";

type DatePickerProps<T> = {
    label?: string,
    value: T,
    format?: string,
    minDate?: T,
    maxDate?: T,
    onChange: (v: T) => void
}

export const DatePicker = <T extends object>({label, value, format, minDate, maxDate, onChange}: DatePickerProps<T>) => {

    return (
        <LocalizationProvider dateAdapter={DateAdapter}>
            <DP label={label}
                 value={value}
                 inputFormat={format}
                 onChange={v => onChange(v as any)}
                 minDate={minDate} maxDate={maxDate}
                 renderInput={(params) => <TextField variant="outlined" autoFocus fullWidth {...params}/>}
            />
        </LocalizationProvider>
    )
}