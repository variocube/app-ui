import {Box, Button, Card, CardContent, CircularProgress, Stack} from "@mui/material";
import {useFlag} from "../utils";
import React, {Fragment, PropsWithChildren, useMemo} from "react";
import {useAsyncCallback} from "react-async-hook";
import {CloseIcon, SaveIcon, SuccessIcon} from "../icons";
import {ErrorAlert} from "../ErrorAlert";

interface EditFormProps {
	loading: boolean;
	onSave: () => Promise<any>;
	onCancel?: () => void;
}

export function EditForm({children, loading, onSave, onCancel}: PropsWithChildren<EditFormProps>) {
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
		<Card>
			<form onSubmit={save} onChange={clearSaved}>
				{children}
				{error && (
					<CardContent>
						<ErrorAlert error={error} />
					</CardContent>
				)}
				<CardContent>
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
