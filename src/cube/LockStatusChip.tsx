import {SvgIconComponent} from "@mui/icons-material";
import ErrorIcon from "@mui/icons-material/Error";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AlertIcon from "@mui/icons-material/NotificationImportant";
import {Chip, ChipProps, Tooltip} from "@mui/material";
import React from "react";
import {Labels} from "../localization";

type LockStatus = "Open" | "Closed" | "Blocked" | "Breakin";

interface LockStatusChipProps extends Omit<ChipProps, "label" | "icon" | "color"> {
	status: LockStatus;
	minimized?: boolean;
	labels: Labels<"open" | "closed" | "blocked" | "breakin">;
}

export function LockStatusChip({status, labels, ...rest}: LockStatusChipProps) {
	switch (status) {
		case "Open":
			return <StatusChip label={labels("open")} Icon={LockOpenIcon} color="warning" {...rest} />;
		case "Closed":
			return <StatusChip label={labels("closed")} Icon={LockIcon} color="success" {...rest} />;
		case "Blocked":
			return <StatusChip label={labels("blocked")} Icon={ErrorIcon} color="error" {...rest} />;
		case "Breakin":
			return <StatusChip label={labels("breakin")} Icon={AlertIcon} color="error" {...rest} />;
	}
}

interface StatusChipProps extends Omit<ChipProps, "label" | "icon" | "color"> {
	label: string;
	Icon: SvgIconComponent;
	color: ChipProps["color"];
	minimized?: boolean;
}

function StatusChip({label, Icon, color, minimized, ...rest}: StatusChipProps) {
	return (
		<Tooltip title={minimized ? label : ""} placement="top">
			<Chip
				sx={{
					"&.MuiChip-root .MuiChip-label": {
						paddingLeft: minimized ? 0 : undefined,
					},
				}}
				color={color}
				icon={<Icon color="inherit" />}
				label={!minimized ? label : undefined}
				{...rest}
			/>
		</Tooltip>
	);
}
