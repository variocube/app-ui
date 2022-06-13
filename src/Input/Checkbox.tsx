import React, {useCallback} from "react";
import {FormControlLabel, Checkbox as MuiCheckbox, CheckboxProps as MuiCheckboxProps} from "@mui/material";

export type CheckboxProps = Omit<MuiCheckboxProps, "onChange" | "value"> & {
    label: string;
    value?: boolean;
    onChange?: (checked: boolean) => any;
    className?: string;
}

export const Checkbox = ({label, value, onChange, disabled, className, color, ...props}: CheckboxProps) => {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e.target.checked);
        }
    }, [onChange]);

    return (
        <FormControlLabel
            control={
                <MuiCheckbox
                    checked={value}
                    onChange={handleChange}
                    disabled={disabled}
                    {...props}
                />
            }
            label={label}
            disabled={disabled}
            className={className}
        />
    )
}