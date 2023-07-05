import {Button, ButtonProps} from "@mui/material";
import * as React from "react";
import {Fragment, PropsWithChildren, useCallback} from "react";
import {useFlag, useIsMounted} from "../utils";
import {ConfirmDialog} from "./ConfirmDialog";

interface ConfirmButtonProps {
    title: string;
    cancel: string;
    onConfirm: (e: React.MouseEvent<HTMLElement>) => Promise<any>;
    fullWidth?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    color?: ButtonProps["color"];
    variant?: ButtonProps["variant"];
}

export function ConfirmButton(props: PropsWithChildren<ConfirmButtonProps>) {
    const {
        fullWidth,
        title,
        cancel,
        icon,
        children,
        onConfirm,
        color,
        variant,
        disabled,
    } = props;
    const isMounted = useIsMounted();
    const [dialogOpen, setDialogOpen, clearDialogOpen] = useFlag(false);

    const handleConfirm = useCallback(async (e: React.MouseEvent<HTMLElement>) => {
        await onConfirm(e);
        if (!e.isDefaultPrevented() && isMounted) {
            clearDialogOpen();
        }
    }, [onConfirm, isMounted]);

    return (
        <Fragment>
            <Button
                onClick={setDialogOpen}
                color={color}
                variant={variant}
                disabled={disabled}
                startIcon={icon}
                fullWidth={fullWidth}
            >
                {title}
            </Button>
            <ConfirmDialog
                open={dialogOpen}
                onClose={clearDialogOpen}
                title={title}
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
