import {ButtonProps, ListItemIcon, ListItemText, MenuItem} from "@mui/material";
import * as React from "react";
import {Fragment, PropsWithChildren, useCallback} from "react";
import {useFlag, useIsMounted} from "../utils";
import {ConfirmDialog} from "./ConfirmDialog";

interface ConfirmButtonProps {
    title: string;
    confirmTitle?: string;
    cancel: string;
    onConfirm: () => Promise<any>;
    fullWidth?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    color?: ButtonProps["color"];
}

export function ConfirmMenuItem(props: PropsWithChildren<ConfirmButtonProps>) {
    const {
        fullWidth,
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
            <MenuItem
                onClick={setDialogOpen}
                disabled={disabled}
            >
                {icon && (
                    <ListItemIcon>{icon}</ListItemIcon>
                )}
                <ListItemText primary={title} />
            </MenuItem>
            <ConfirmDialog
                open={dialogOpen}
                onClose={clearDialogOpen}
                title={title}
                confirmTitle={confirmTitle}
                cancel={cancel}
                onConfirm={handleConfirm}
                color={color}
                fullWidth={fullWidth}
                icon={icon}
            >
                {children}
            </ConfirmDialog>
        </Fragment>
    );
}
