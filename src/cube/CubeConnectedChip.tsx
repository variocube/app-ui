import SuccessIcon from "@mui/icons-material/Done";
import ErrorIcon from "@mui/icons-material/Error";
import {Chip, ChipProps} from "@mui/material";
import React from "react";
import {Labels} from "../localization";

interface CubeConnectedChipProps extends Omit<ChipProps, "color" | "icon" | "label"> {
	connected: boolean;
	labels: Labels<"connected" | "disconnected">;
}

export function CubeConnectedChip({connected, labels, ...chipProps}: CubeConnectedChipProps) {
	return connected
		? <Chip color="success" icon={<SuccessIcon />} label={labels("connected")} {...chipProps} />
		: <Chip color="error" icon={<ErrorIcon />} label={labels("disconnected")} {...chipProps} />;
}
