import {AdapterLuxon} from "@mui/x-date-pickers/AdapterLuxon";
import {DatePicker as DP, LocalizationProvider} from "@mui/x-date-pickers";
import {TextField} from "@mui/material";
import * as React from "react";

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
        <LocalizationProvider dateAdapter={AdapterLuxon}>
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