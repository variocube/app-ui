import * as React from "react";
import {TextField, TextFieldProps} from "./TextField";
import {useState} from "react";

export type EmailSenderFieldProps = Omit<TextFieldProps, "onChange"> & {
    onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => any;
    updateValidity?: (valid: boolean) => void;
}

export function EmailSenderField({onChange, validate, onBlur, helperText, select, SelectProps, error, updateValidity, ...props}: EmailSenderFieldProps) {
    const [valid, setValid] = useState<boolean>(false);

    async function validateEmailSender(value: string) {
        let valid = false;
        if(isEmail(value)) {
            const response = await fetch("https://28pdqh9qy3.execute-api.eu-west-1.amazonaws.com/dev/validate-email-sender", {
                method: "POST",
                body: JSON.stringify({
                    "email": value
                })
            });
            if(response.ok) {
                const json = await response.json();
                valid = json.valid;
            }
        }
        setValid(valid);
        if(updateValidity) {
            updateValidity(valid);
        }
    }

    function handleChange(value: string, e: React.ChangeEvent<HTMLInputElement>) {
        if (onChange) {
            onChange(value, e);
        }
        validateEmailSender(value);
    }

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
        const value = e.currentTarget?.value || e.target.value;
        if (onBlur) {
            onBlur(e);
        }
        validateEmailSender(value);
    }

    return (
        <TextField
            {...props}
            onChange={handleChange}
            onBlur={handleBlur}
            error={error || !valid}
        />
    );
}

export function isEmail(email: string): boolean {
    if(!email) {
        return false;
    }
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}