import React, {useCallback} from "react";
import {TextField as MuiTextField, TextFieldProps as MuiTextFieldProps} from "@mui/material";

type TextFieldProps = Omit<MuiTextFieldProps, "onChange"> & {
    onChange?: (value: string) => any;
}

export function TextField({onChange, ...props}: TextFieldProps) {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange && onChange(e.currentTarget.value);
    }, [onChange]);

    return (
        <MuiTextField onChange={handleChange} {...props} />
    );
}
