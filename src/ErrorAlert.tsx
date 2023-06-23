import { Alert, AlertTitle } from '@mui/material';
import * as React from "react";
import {ErrorIcon} from "./icons";
import {ForwardedRef} from "react";

export const ErrorAlert = React.forwardRef(({error}: {error: any}, ref: ForwardedRef<HTMLDivElement>) => {
    if (!error) {
        return null;
    }
    const {message, details} = formatError(error);
    return (
        <Alert ref={ref} color="error" icon={<ErrorIcon/>}>
            <AlertTitle>{message}</AlertTitle>
            {details}
        </Alert>
    );
});

function formatError(error: any) {
    if (typeof error == "string") {
        return {
            message: error,
        };
    }
    else if (error.message) {
        return {
            message: error.status ? `${error.status} ${error.message}` : error.message,
            details: error.details,
        };
    }
    else {
        return {
            message: error.toString(),
        };
    }
}
