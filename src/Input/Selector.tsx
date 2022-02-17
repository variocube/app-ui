import React, {PropsWithChildren, useEffect, useState} from "react";
import {MenuItem, TextField} from "@mui/material";

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
    const [input, setInput] = useState(value || '');

    const handleChange = (e: any) => {
        setInput(e.target.value);
        if (onChange) onChange(e.target.value);
    }

    useEffect(() => {
        if (value !== input) setInput(value || '');
    }, [value]);

    return (
        <TextField select fullWidth variant="outlined" size={size}
                   label={label}
                   onChange={handleChange}
                   disabled={disabled}
                   name={name} value={input}
                   error={error}
                   helperText={helperText}
                   className={className}
        >
            {options.map((o, i) => (
                <MenuItem key={'select-item-' + o.value + '-' + i} value={o.value}>{o.label}</MenuItem>
            ))}
        </TextField>
    )
}