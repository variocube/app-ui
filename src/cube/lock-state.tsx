import React from "react";
import {Chip, ChipProps, ChipPropsColorOverrides, Tooltip} from "@mui/material";
import {SvgIconComponent} from "@mui/icons-material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import ErrorIcon from "@mui/icons-material/Error";
import AlertIcon from "@mui/icons-material/NotificationImportant";
import {amber, green, red} from "@mui/material/colors";

type LockStatus = 'Open'|'Closed'|'Blocked'|'Breakin';

type TFunction = (key: 'lockStatus.Open'|'lockStatus.Closed'|'lockStatus.Blocked'|'lockStatus.Breakin') => string;

interface LockStateProps {
    status: LockStatus;
    minimized?: boolean,
    t?: TFunction;
}

export function LockState({status, ...rest}: LockStateProps) {
    switch (status) {
        case 'Open':
            return <LockStatusOpen {...rest} />;
        case 'Closed':
            return <LockStatusClosed {...rest} />;
        case 'Blocked':
            return <LockStatusBlocked {...rest} />;
        case 'Breakin':
            return <LockStatusBreakin {...rest} />;
    }
}

function LockStatusOpen({t, ...rest}: Omit<LockStateProps, 'status'>) {
    const label = t ? t('lockStatus.Open') : 'Open';
    return <StatusChip label={label} Icon={LockOpenIcon} color={amber[600]} {...rest} />;
}

function LockStatusClosed({t, ...rest}: Omit<LockStateProps, 'status'>) {
    const label = t ? t('lockStatus.Closed') : 'Closed';
    return <StatusChip label={label} Icon={LockIcon} color={green[500]} {...rest} />;
}

function LockStatusBlocked({t, ...rest}: Omit<LockStateProps, 'status'>) {
    const label = t ? t('lockStatus.Blocked') : 'Blocked';
    return <StatusChip label={label} Icon={ErrorIcon} color={red[600]} {...rest} />;
}

function LockStatusBreakin({t, ...rest}: Omit<LockStateProps, 'status'>) {
    const label = t ? t('lockStatus.Breakin') : 'Breakin';
    return <StatusChip label={label} Icon={AlertIcon} color={red[900]} {...rest} />;
}

interface StatusChipProps {
    label: string;
    Icon: SvgIconComponent;
    color?: string;
    minimized?: boolean;
}

function StatusChip({label, Icon, color, minimized}: StatusChipProps) {
    return (
        <Tooltip title={minimized ? label : ''} placement="top">
            <Chip
                sx={{
                    color: '#fff !important',
                    background: color,
                    "&.MuiChip-root .MuiChip-label": {
                        paddingLeft: minimized ? 0 : undefined
                    },
                    "&.MuiChip-root .MuiChip-icon": {
                        color: '#fff !important',
                    },
                }}
                icon={<Icon color="inherit" />}
                label={!minimized ? label : undefined}
            />
        </Tooltip>
    )
}