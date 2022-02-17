import React from "react";
import {FormControlLabel, Checkbox as CB} from "@mui/material";

type CheckboxProps = {
    label: string,
    value: boolean,
    onChange?: (checked: boolean, name?: string) => void,
    disabled?: boolean,
    name?: string,
    className?: string,
    color?: 'primary'|'secondary'
}

export const Checkbox = ({label, value, onChange, disabled, name, className, color}: CheckboxProps) => {
    const handleChange = (e: any) => {
        if (onChange) onChange(e.target.checked, name);
    }

    return (
        <FormControlLabel
            control={
                <CB color={color || 'primary'}
                    checked={value}
                    onChange={handleChange}
                />
            }
            label={label}
            disabled={disabled}
            className={className}
        />
    )
}