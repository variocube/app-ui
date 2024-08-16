import {
	Button,
	Card,
	CardContent,
	CardContentProps as MuiCardContentProps,
	CardProps as MuiCardProps,
	CircularProgress,
	Stack,
} from "@mui/material";
import React, {PropsWithChildren, useMemo} from "react";
import {useAsyncCallback} from "react-async-hook";
import {ErrorAlert} from "../ErrorAlert";
import {CloseIcon, SaveIcon, SuccessIcon} from "../icons";
import {Labels} from "../localization";
import {useFlag} from "../utils";

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
	const [saved, setSaved, clearSaved] = useFlag(false);

	const {loading: saving, error, execute: save} = useAsyncCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			clearSaved();
			await onSave();
			setSaved();
		},
	);

	const pending = loading || saving;

	const icon = useMemo(() => {
		if (pending) {
			return <CircularProgress size={16} sx={{mx: 0.25}} />;
		}
		if (saved) {
			return <SuccessIcon fontSize="small" />;
		}
		return <SaveIcon />;
	}, [pending, saved]);

	return (
		<Card {...CardProps}>
			<form onSubmit={save} onChange={clearSaved}>
				{children}
				{error && (
					<CardContent {...CardContentProps}>
						<ErrorAlert error={error} />
					</CardContent>
				)}
				<CardContent {...CardContentProps}>
					<Stack direction="row" spacing={2}>
						<Button
							type="submit"
							variant="outlined"
							disabled={pending}
							startIcon={icon}
							color={saved ? "success" : "primary"}
						>
							{labels("save")}
						</Button>
						{onCancel && (
							<Button
								variant="outlined"
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
