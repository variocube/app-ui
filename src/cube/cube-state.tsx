import React from "react";
import {Chip, ChipProps} from "@mui/material";
import SuccessIcon from "@mui/icons-material/Done";
import ErrorIcon from "@mui/icons-material/Error";

type TFunction = (key: 'cubeStatus.Connected'|'cubeStatus.Disconnected') => string;

interface CubeStateProps {
    connected: boolean;
    t?: TFunction;
}

export function CubeState({connected, t}: CubeStateProps) {
    let label;
    if (connected) {
        label = t ? t('cubeStatus.Connected') : 'Connected';
        return <SuccessChip icon={<SuccessIcon />} label={label} />;
    }
    label = t ? t('cubeStatus.Disconnected') : 'Disconnected';
    return <ErrorChip icon={<ErrorIcon />} label={label} />;
}

function ErrorChip(props: ChipProps) {
    return <Chip color="error" {...props} />
}

function SuccessChip(props: ChipProps) {
    return <Chip color="success" {...props} />
}