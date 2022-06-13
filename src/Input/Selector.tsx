import React, {PropsWithChildren, useCallback, useEffect, useState} from "react";
import {MenuItem, TextField} from "@mui/material";
import {TextFieldProps} from "@mui/material/TextField/TextField";

type SelectorProps = Omit<TextFieldProps, "onChange" | "value"> & {
    value: string | undefined;
    onChange: (value: string) => any,
    options: { label: string, value: string }[],
}

export const Selector = ({value, onChange, fullWidth = true, options, ...props}: PropsWithChildren<SelectorProps>) => {
    const [input, setInput] = useState(value || '');

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        if (onChange) {
            onChange(e.target.value);
        }
    }, [onChange]);

    useEffect(() => {
        if (value !== input) setInput(value || '');
    }, [value]);

    return (
        <TextField
            {...props}
            select
            value={input}
            fullWidth={fullWidth}
            onChange={handleChange}
        >
            {options.map((o, i) => (
                <MenuItem key={'select-item-' + o.value + '-' + i} value={o.value}>{o.label}</MenuItem>
            ))}
        </TextField>
    )
}