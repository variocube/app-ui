import {Alert, AlertTitle, Typography} from "@mui/material";
import * as React from "react";
import {ForwardedRef} from "react";
import {ApiError, ProblemJson} from "./fetch";
import {ErrorIcon} from "./icons";

export interface ErrorAlertProps {
	/**
	 * The error to display.
	 *
	 * This can be an API error, JavaScript error, an error message string. If the passed value evaluates to `false`,
	 * no error message is displayed.
	 */

	error: Partial<ProblemJson> | Error | string | any;
}

export const ErrorAlert = React.forwardRef(
	({error}: ErrorAlertProps, ref: ForwardedRef<HTMLDivElement>) => {
		if (!error) {
			return null;
		}
		const {title, status, detail, type, instance, stack, ...rest} = normalizeError(error);
		return (
			<Alert ref={ref} severity="error" icon={<ErrorIcon />}>
				<AlertTitle>{title}</AlertTitle>
				{detail}
				{status && <Typography component="div" variant="caption">Status: {status}</Typography>}
				{instance && <Typography component="div" variant="caption">Instance: {instance}</Typography>}
				{type && type != "about:blank" && (
					<Typography component="div" variant="caption">Type: {type}</Typography>
				)}
				{Object.entries(rest).map(([key, value]) => (
					<Typography component="div" variant="caption" key={key}>{key}: {value}</Typography>
				))}
			</Alert>
		);
	},
);

type NormalizedError =
	// `title` from `ProblemJson` is required
	& Pick<ProblemJson, "title">
	// other properties from `ProblemJson` are optional
	& Partial<ProblemJson>
	// properties from `Error` are optional
	& Partial<Error>;

function normalizeError(error: any): NormalizedError {
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
		};
	}
	if (typeof error.title != "undefined") {
		return error;
	}
	return {
		title: error.toString(),
	};
}
