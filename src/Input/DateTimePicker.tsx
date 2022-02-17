import React from "react";
import {DateTimePicker as DTP} from "@mui/lab";
import {TextField} from "@mui/material";
import DateAdapter from "@mui/lab/AdapterLuxon";
import LocalizationProvider from '@mui/lab/LocalizationProvider';

type DateTimePickerProps<T> = {
    label?: string,
    minDate?: T,
    maxDate?: T,
    value: T,
    onChange: (value?: T) => void,
    format?: string,

}

export const DateTimePicker = <T extends object> ({label, value, minDate, maxDate, onChange, format}: DateTimePickerProps<T>) => {
    return (
        <LocalizationProvider dateAdapter={DateAdapter}>
            <DTP label={label}
                 value={value}
                 inputFormat={format}
                 ampm={false}
                 ampmInClock={false}
                 onChange={v => onChange(v as any)}
                 minDate={minDate} maxDate={maxDate} minutesStep={15}
                 renderInput={(params) => <TextField variant="outlined" autoFocus fullWidth {...params}/>}
            />
        </LocalizationProvider>
    )
}