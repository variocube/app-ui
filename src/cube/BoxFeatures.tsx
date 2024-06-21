import {SvgIconComponent} from "@mui/icons-material";
import AccessibleIcon from "@mui/icons-material/Accessible";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import ChargerIcon from "@mui/icons-material/ChargingStation";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {Chip, Stack, Tooltip} from "@mui/material";
import {amber, green, lightBlue, red} from "@mui/material/colors";
import React from "react";
import {Labels} from "../localization";

export type BoxFeature = "Accessible" | "Cooled" | "DangerousGoods" | "Charger";

interface BoxFeaturesProps {
	features: Array<BoxFeature>;
	labels: Labels<BoxFeature | "None">;
	minimized?: boolean;
	renderEmpty?: boolean;
}

export function BoxFeatures(props: BoxFeaturesProps) {
	const {
		features,
		renderEmpty,
		minimized,
		labels,
	} = props;

	if (renderEmpty && features.length == 0) {
		return <span>{labels("None")}</span>;
	}
	return (
		<Stack direction="row" spacing={1}>
			{features.sort().map(feature => (
				<FlagChip
					key={feature}
					label={labels(feature)}
					color={COLORS[feature]}
					Icon={ICONS[feature]}
					minimized={minimized}
				/>
			))}
		</Stack>
	);
}

const COLORS: Record<BoxFeature, string> = {
	Accessible: amber[800],
	Cooled: lightBlue[400],
	DangerousGoods: red[400],
	Charger: green[400],
};

const ICONS: Record<BoxFeature, SvgIconComponent> = {
	Accessible: AccessibleIcon,
	Cooled: AcUnitIcon,
	DangerousGoods: WarningAmberIcon,
	Charger: ChargerIcon,
};

interface FlagProps {
	minimized?: boolean;
	label: string;
}

interface FlagChipProps extends FlagProps {
	label: string;
	color: string;
	Icon: SvgIconComponent;
}

function FlagChip({label, color, Icon, minimized}: FlagChipProps) {
	return (
		<Tooltip title={minimized ? label : ""} placement="top">
			<Chip
				sx={{
					borderColor: color,
					color,
					"&.MuiChip-root .MuiChip-icon": {
						color,
					},
					"&.MuiChip-root .MuiChip-label": {
						paddingLeft: minimized ? 0 : undefined,
					},
				}}
				variant="outlined"
				icon={<Icon />}
				label={!minimized ? label : undefined}
			/>
		</Tooltip>
	);
}
