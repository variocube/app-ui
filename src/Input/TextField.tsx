import React, {useCallback, useRef, useState} from "react";
import {TextField as MuiTextField, TextFieldProps as MuiTextFieldProps} from "@mui/material";

type TextFieldProps = Omit<MuiTextFieldProps, "onChange"> & {
    onChange?: (value: string) => any;
    validate?: (value: string) => string | undefined;
}

export function TextField({onChange, validate, onBlur, helperText, ...props}: TextFieldProps) {
    const input = useRef<HTMLInputElement | undefined>();
    const [wasValidated, setWasValidated] = useState(0);

    const incWasValidated = useCallback(() => setWasValidated(v => v + 1), []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.currentTarget;
        onChange && onChange(value);

        if (wasValidated > 0 && input.current && validate) {
            input.current.setCustomValidity(validate(value) || "");
            incWasValidated();
        }
    }, [onChange, wasValidated]);

    const handleBlur = useCallback(e => {
        const {value} = e.currentTarget;
        if (input.current && validate) {
            input.current.setCustomValidity(validate(value) || "");
            incWasValidated();
        }
        else if (wasValidated > 0) {
            incWasValidated();
        }
        onBlur && onBlur(e);
    }, [onBlur, validate, wasValidated]);

    const error = (wasValidated > 0) && input.current != null && !input.current.validity.valid;

    return (
        <MuiTextField
            {...props}
            onChange={handleChange}
            onInvalid={incWasValidated}
            inputRef={input}
            onBlur={handleBlur}
            error={error}
            helperText={error ? input.current?.validationMessage : helperText}
        />
    );
}
