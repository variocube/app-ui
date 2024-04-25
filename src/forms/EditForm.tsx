import {Button, Card, CardContent, CircularProgress, Stack, CardProps as MuiCardProps, CardContentProps as MuiCardContentProps} from "@mui/material";
import {useFlag} from "../utils";
import React, {PropsWithChildren, useMemo} from "react";
import {useAsyncCallback} from "react-async-hook";
import {CloseIcon, SaveIcon, SuccessIcon} from "../icons";
import {ErrorAlert} from "../ErrorAlert";

interface EditFormProps {
	loading: boolean;
	onSave: () => Promise<any>;
	onCancel?: () => void;
	CardProps?: MuiCardProps;
	CardContentProps?: MuiCardContentProps;
}

export function EditForm({children, loading, onSave, onCancel, CardProps, CardContentProps}: PropsWithChildren<EditFormProps>) {
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
							Save
						</Button>
						{onCancel && (
							<Button
								variant="outlined"
								disabled={pending}
								startIcon={<CloseIcon />}
								onClick={onCancel}
							>
								Cancel
							</Button>
						)}
					</Stack>
				</CardContent>
			</form>
		</Card>
	);
}
