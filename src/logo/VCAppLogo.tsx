import {Box, BoxProps} from "@mui/material";
import React from "react";
import {VCLogoIcon} from "./VCLogoIcon";

interface VCAppLogoProps extends BoxProps {
	appName?: string;
}

export function VCAppLogo({appName, ...props}: VCAppLogoProps) {
	return (
		<Box {...props}>
			<Box sx={{display: "flex", flexFlow: "row nowrap", alignItems: "center"}}>
				<VCLogoIcon width="auto" height="32" display="block" />
				{appName && (
					<Box
						sx={{
							lineHeight: 1,
							fontSize: "20px",
							fontWeight: 900,
							textTransform: "uppercase",
							marginLeft: "8px",
						}}
					>
						{appName}
					</Box>
				)}
			</Box>
		</Box>
	);
}
