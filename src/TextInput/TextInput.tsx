import React from "react";
import {TextField} from "@material-ui/core";

type TextInputProps = {
    label: string,
    onChange: (value: string|number, name?: string) => void,
    disabled?: boolean,
    name?: string,
    value?: string|number,
    error?: boolean,
    helperText?: string
}

export const TextInput = ({label, onChange, disabled, name, value, error, helperText}: TextInputProps) => (
    <TextField fullWidth variant="outlined"
               label={label}
               onChange={e => onChange(e.target.value, name)}
               disabled={disabled}
               name={name} value={value}
               error={error}
               helperText={helperText}
    />
)