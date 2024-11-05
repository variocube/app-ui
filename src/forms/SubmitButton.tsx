import {Button, ButtonProps, CircularProgress} from "@mui/material";
import React, {ReactNode, useMemo} from "react";
import {SaveIcon, SuccessIcon} from "../icons";

interface SubmitButtonProps extends Omit<ButtonProps, "startIcon" | "type"> {
	submitting: boolean;
	submitted: boolean;
	icon?: ReactNode;
}

export function SubmitButton(props: SubmitButtonProps) {
	const {icon, submitted, submitting, disabled, ...rest} = props;

	const dynamicIcon = useMemo(() => {
		if (submitting) {
			return <CircularProgress size={16} sx={{mx: 0.25}} />;
		}
		if (submitted) {
			return <SuccessIcon fontSize="small" />;
		}
		return icon ?? <SaveIcon />;
	}, [submitting, submitted]);

	return (
		<Button
			type="submit"
			variant="outlined"
			startIcon={dynamicIcon}
			disabled={disabled || submitting}
			color={submitted ? "success" : "primary"}
			{...rest}
		/>
	);
}
