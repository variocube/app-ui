import React, {useRef, useState} from "react";
import {TextField as MuiTextField, TextFieldProps as MuiTextFieldProps} from "@mui/material";

type TextFieldProps = Omit<MuiTextFieldProps, "inputRef" | "onChange"> & {
    onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => any;
    validate?: (value: string) => string | undefined;
}

export function TextField({onChange, validate, onBlur, helperText, ...props}: TextFieldProps) {
    const input = useRef<HTMLInputElement | undefined>();
    const [validationCount, setValidationCount] = useState(0);

    const incValidationCount = () => setValidationCount(v => v + 1);
    const wasValidated = validationCount > 0;

    const error = (validationCount > 0) && input.current != null && !input.current.validity.valid;

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const {value} = e.currentTarget;
        if (onChange) {
            onChange(value, e);
        }
        if (wasValidated) {
            if (input.current && validate) {
                input.current.setCustomValidity(validate(value) || "");
            }
            incValidationCount();
        }
    }

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
        const {value} = e.currentTarget;
        if (input.current && validate) {
            input.current.setCustomValidity(validate(value) || "");
            incValidationCount();
        }
        else if (validationCount > 0) {
            incValidationCount();
        }
        onBlur && onBlur(e);
    }

    return (
        <MuiTextField
            {...props}
            onChange={handleChange}
            onInvalid={incValidationCount}
            inputRef={input}
            onBlur={handleBlur}
            error={error}
            helperText={error ? input.current?.validationMessage : helperText}
        />
    );
}
