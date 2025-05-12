import {Alert, AlertTitle, Typography} from '@mui/material';
import * as React from "react";
import {ErrorIcon} from "./icons";
import {ForwardedRef} from "react";
import {ApiError, ProblemJson} from "./fetch";

export const ErrorAlert = React.forwardRef(({error}: {error: Partial<ProblemJson> | Error | string | any}, ref: ForwardedRef<HTMLDivElement>) => {
    if (!error) {
        return null;
    }
    const {title, status, detail, type, instance, stack, ...rest} = normalizeError(error);
    return (
        <Alert ref={ref} color="error" icon={<ErrorIcon/>}>
            <AlertTitle>{title}</AlertTitle>
			{detail}
			{status && <Typography component="div" variant="caption">Status: {status}</Typography>}
			{instance && <Typography component="div" variant="caption">Instance: {instance}</Typography>}
			{type && type != "about:blank" && <Typography component="div" variant="caption">Type: {type}</Typography>}
			{Object.keys(rest).map(key => (
				<Typography component="div" variant="caption" key={key}>{key}: {rest[key]}</Typography>
			))}
        </Alert>
    );
});

function normalizeError(error: any): Pick<ProblemJson, "title"> & Partial<ProblemJson> & Partial<Error> {
	if (typeof error == "string") {
		return {
			title: error,
		};
	}
	if (error instanceof ApiError) {
		return error;
	}
	if (error instanceof Error) {
		return {
			title: error.message,
			type: error.name,
			stack: error.stack,
		}
	}
	if (typeof error.title != "undefined") {
		return error;
	}
	return {
		title: error.toString(),
	}
}
