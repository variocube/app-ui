import {
	Button,
	Card,
	CardContent,
	CardContentProps as MuiCardContentProps,
	CardProps as MuiCardProps,
	Stack,
} from "@mui/material";
import React, {PropsWithChildren} from "react";
import {ErrorAlert} from "../ErrorAlert";
import {CloseIcon} from "../icons";
import {Labels} from "../localization";
import {SubmitButton} from "./SubmitButton";
import {useFormSubmit} from "./useFormSubmit";

interface EditFormProps {
	loading: boolean;
	onSave: () => Promise<any>;
	onCancel?: () => void;
	CardProps?: MuiCardProps;
	CardContentProps?: MuiCardContentProps;
	labels: Labels<"save" | "cancel">;
}

export function EditForm(
	{children, loading, onSave, onCancel, CardProps, CardContentProps, labels}: PropsWithChildren<EditFormProps>,
) {
	const {onSubmit, onChange, submitted, submitting, error} = useFormSubmit({
		onSubmit: onSave,
	});

	const pending = loading || submitting;

	return (
		<Card {...CardProps}>
			<form onSubmit={onSubmit} onChange={onChange}>
				{children}
				{error && (
					<CardContent {...CardContentProps}>
						<ErrorAlert error={error} />
					</CardContent>
				)}
				<CardContent {...CardContentProps}>
					<Stack direction="row" spacing={2}>
						<SubmitButton
							variant="outlined"
							disabled={pending}
							submitted={submitted}
							submitting={submitting}
						>
							{labels("save")}
						</SubmitButton>
						{onCancel && (
							<Button
								variant="outlined"
								color="inherit"
								disabled={pending}
								startIcon={<CloseIcon />}
								onClick={onCancel}
							>
								{labels("cancel")}
							</Button>
						)}
					</Stack>
				</CardContent>
			</form>
		</Card>
	);
}
