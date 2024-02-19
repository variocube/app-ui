import React, {useRef, useState} from "react";
import {TextField as MuiTextField, TextFieldProps as MuiTextFieldProps} from "@mui/material";

export type TextFieldProps = Omit<MuiTextFieldProps, "inputRef" | "onChange"> & {
    onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => any;
    validate?: (value: string) => string | undefined;
}

export function TextField({onChange, validate, onBlur, helperText, select, SelectProps, ...props}: TextFieldProps) {
    const input = useRef<HTMLInputElement | undefined>();
    const [validationCount, setValidationCount] = useState(0);

    const incValidationCount = () => setValidationCount(v => v + 1);
    const wasValidated = validationCount > 0;

    const error = wasValidated && input.current != null && !input.current.validity.valid;

    function maybeUpdateValidity(value: string) {
        if (wasValidated) {
            if (validate) {
                input.current?.setCustomValidity(validate(value) || "");
            }
        }
		incValidationCount();
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.currentTarget?.value || e.target.value;
        maybeUpdateValidity(value);
        if (onChange) {
            onChange(value, e);
        }
    }

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
        const value = e.currentTarget?.value || e.target.value;
        maybeUpdateValidity(value);
        if (onBlur) {
            onBlur(e);
        }
    }

    // Despite typed differently, a MUI TextField with the `select` property set,
    // provides a ref that is an object with a `node` property which contains the
    // actual input element. We handle both cases here.
    function handleInputRef(ref: HTMLInputElement | {node: HTMLInputElement}) {
        const element = ref instanceof HTMLInputElement ? ref : ref?.node;
        if (element) {
            input.current = element;
        }
    }

    return (
        <MuiTextField
            {...props}
            select={select}
            SelectProps={SelectProps && {
                ...SelectProps,
                native: true,
            }}
            onChange={handleChange}
            onInvalid={incValidationCount}
            onBlur={handleBlur}
            inputRef={handleInputRef}
            error={error}
            helperText={error ? input.current?.validationMessage : helperText}
        />
    );
}
