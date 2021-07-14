import React from "react";
import {TextField} from "@material-ui/core";

type TextInputProps = {
    label: string,
    value: any,
    onChange?: (value: any, name?: string) => void,
    disabled?: boolean,
    name?: string,
    error?: boolean,
    helperText?: string,
    className?: string,
    multiline?: boolean,
    rows?: number,
    maxRow?: number,
    size?: 'small' | 'medium'
}

export const TextInput = ({label, onChange, disabled, name, value, error, helperText, className, size, multiline, rows, maxRow}: TextInputProps) => {
    const handleChange = (e: any) => {
        if (onChange) onChange(e.target.value, name);
    }

    return (
        <TextField fullWidth variant="outlined" size={size}
                   multiline={multiline} rows={rows} rowsMax={maxRow}
                   label={label}
                   onChange={handleChange}
                   disabled={disabled}
                   name={name} value={value}
                   error={error}
                   helperText={helperText}
                   className={className}
        />
    )
}