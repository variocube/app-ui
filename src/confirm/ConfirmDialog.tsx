import {Button, ButtonProps, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import * as React from "react";
import {useAsyncCallback} from "react-async-hook";
import {ErrorAlert} from "../ErrorAlert";
import {PropsWithChildren} from "react";

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    cancel: string;
    onConfirm: (e: React.MouseEvent<HTMLElement>) => Promise<any>;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    color?: ButtonProps["color"];
}

export function ConfirmDialog(props: PropsWithChildren<ConfirmDialogProps>) {
    const {
        open,
        onClose,
        title,
        cancel,
        onConfirm,
        fullWidth = true,
        icon,
        color = "primary",
        children
    } = props;
    const handleConfirm = useAsyncCallback(onConfirm);
    return (
        <Dialog fullWidth={fullWidth} open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{children}</DialogContent>
            {handleConfirm.error && (
                <DialogContent>
                    <ErrorAlert error={handleConfirm.error}/>
                </DialogContent>
            )}
            <DialogActions>
                <Button
                    color={color}
                    onClick={handleConfirm.execute}
                    disabled={handleConfirm.loading}
                    startIcon={handleConfirm.loading ? <CircularProgress color={color} size={16} sx={{mx: 0.25}} /> : icon}
                >
                    {title}
                </Button>
                <Button onClick={onClose} color="inherit">
                    {cancel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
