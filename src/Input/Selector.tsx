import React, {PropsWithChildren} from "react";
import {MenuItem, TextField} from "@material-ui/core";

type SelectorProps = {
    label: string,
    value: any,
    onChange: (value: any) => void,
    options: { label: string, value: any }[],
    disabled?: boolean,
    name?: string,
    error?: boolean,
    helperText?: string,
    className?: string,
    size?: 'small' | 'medium'
}

export const Selector = ({label, value, onChange, options, disabled, name, error, helperText, className, size}: PropsWithChildren<SelectorProps>) => {
    const handleChange = (e: any) => {
        if (onChange) onChange(e.target.value);
    }

    return (
        <TextField select fullWidth variant="outlined" size={size}
                   label={label}
                   onChange={handleChange}
                   disabled={disabled}
                   name={name} value={value}
                   error={error}
                   helperText={helperText}
                   className={className}
        >
            {options.map((o, i) => (
                <MenuItem key={'select-item-' + o.value + '-' + i}>{o.label}</MenuItem>
            ))}
        </TextField>
    )
}