import {Button, ButtonProps, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import * as React from "react";
import {PropsWithChildren} from "react";
import {useAsyncCallback} from "react-async-hook";
import {ErrorAlert} from "../ErrorAlert";

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    confirmTitle?: string;
    cancel: string;
    onConfirm: () => Promise<any>;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    color?: ButtonProps["color"];
}

export function ConfirmDialog(props: PropsWithChildren<ConfirmDialogProps>) {
    const {
        open,
        onClose,
        title,
        confirmTitle = title,
        cancel,
        onConfirm,
        fullWidth = true,
        icon,
        color = "primary",
        children
    } = props;

    const {loading, error, execute} = useAsyncCallback(onConfirm);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (e.currentTarget.reportValidity()) {
            await execute();
        }
    }

    return (
        <Dialog fullWidth={fullWidth} open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>{children}</DialogContent>
                {error && (
                    <DialogContent>
                        <ErrorAlert error={error}/>
                    </DialogContent>
                )}
                <DialogActions>
                    <Button
                        type="submit"
                        color={color}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress color={color} size={16} sx={{mx: 0.25}} /> : icon}
                    >
                        {confirmTitle}
                    </Button>
                    <Button onClick={onClose} color="inherit">
                        {cancel}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
