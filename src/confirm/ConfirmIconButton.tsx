import {ButtonProps, IconButton} from "@mui/material";
import * as React from "react";
import {Fragment, PropsWithChildren, useCallback} from "react";
import {useFlag, useIsMounted} from "../utils";
import {ConfirmDialog} from "./ConfirmDialog";

interface ConfirmIconButtonProps {
	title: string;
	confirmTitle?: string;
	cancel: string;
	onConfirm: () => Promise<any>;
	disabled?: boolean;
	icon?: React.ReactNode;
	color?: ButtonProps["color"];
}

export function ConfirmIconButton(props: PropsWithChildren<ConfirmIconButtonProps>) {
	const {
		title,
		confirmTitle,
		cancel,
		icon,
		children,
		onConfirm,
		color,
		disabled,
	} = props;
	const isMounted = useIsMounted();
	const [dialogOpen, setDialogOpen, clearDialogOpen] = useFlag(false);

	const handleConfirm = useCallback(async () => {
		await onConfirm();
		if (isMounted) {
			clearDialogOpen();
		}
	}, [onConfirm, isMounted]);

	return (
		<Fragment>
			<IconButton
				onClick={setDialogOpen}
				color={color}
				disabled={disabled}
				title={title}
			>
				{icon}
			</IconButton>
			<ConfirmDialog
				open={dialogOpen}
				onClose={clearDialogOpen}
				title={title}
				confirmTitle={confirmTitle}
				cancel={cancel}
				onConfirm={handleConfirm}
				color={color}
				icon={icon}
			>
				{children}
			</ConfirmDialog>
		</Fragment>
	);
}
