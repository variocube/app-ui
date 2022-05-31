import * as React from "react";
import {DateTimePicker as DTP} from "@mui/x-date-pickers";
import {TextField} from "@mui/material";
import {AdapterLuxon} from "@mui/x-date-pickers/AdapterLuxon";
import {LocalizationProvider} from '@mui/x-date-pickers';

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
        <LocalizationProvider dateAdapter={AdapterLuxon}>
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