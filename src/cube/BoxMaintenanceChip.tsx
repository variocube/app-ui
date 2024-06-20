import HandymanIcon from "@mui/icons-material/Handyman";
import {Chip, Tooltip} from "@mui/material";
import React from "react";
import {Labels} from "../localization";

interface BoxMaintenanceChipProps {
	maintenanceRequiredAt?: string | undefined | null;
	minimized?: boolean;
	labels: Labels<"maintenanceRequired">;
}

export function BoxMaintenanceChip({maintenanceRequiredAt, minimized, labels}: BoxMaintenanceChipProps) {
	if (!maintenanceRequiredAt) {
		return null;
	}
	return (
		<Tooltip
			title={minimized ? labels("maintenanceRequired") : undefined}
			placement="top"
		>
			<Chip
				sx={{
					"&.MuiChip-root .MuiChip-label": {
						paddingLeft: minimized ? 0 : undefined,
					},
				}}
				color="warning"
				icon={<HandymanIcon />}
				label={!minimized ? labels("maintenanceRequired") : undefined}
			/>
		</Tooltip>
	);
}
