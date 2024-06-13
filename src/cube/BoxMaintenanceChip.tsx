import HandymanIcon from "@mui/icons-material/Handyman";
import {Chip, Tooltip, Typography} from "@mui/material";
import React from "react"; 

interface BoxMaintenanceChipProps {
	maintenanceRequiredAt: string;
	minimized?: boolean;
	t: any;
}

export function BoxMaintenanceChip({maintenanceRequiredAt, minimized, t}: BoxMaintenanceChipProps) { 
	return (
		<Tooltip
			title={
				<Typography>
					t("maintenanceRequiredAt") {maintenanceRequiredAt} 
				</Typography>
			}
		>
			<Chip
				sx={{
					"&.MuiChip-root .MuiChip-label": {
						paddingLeft: minimized ? 0 : undefined,
					},
				}}
				color="warning"
				icon={<HandymanIcon />}
				label={!minimized ? t("maintenanceRequired"): undefined}
			/>
		</Tooltip>
	);
}
