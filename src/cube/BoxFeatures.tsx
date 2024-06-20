import {SvgIconComponent} from "@mui/icons-material";
import AccessibleIcon from "@mui/icons-material/Accessible";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import ChargerIcon from "@mui/icons-material/ChargingStation";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {Chip, Stack, Tooltip} from "@mui/material";
import {amber, green, lightBlue, red} from "@mui/material/colors";
import React from "react";
import {Labels} from "../localization";

interface BoxFeaturesProps {
	accessible: boolean;
	cooled: boolean;
	dangerousGoods: boolean;
	charger: boolean;
	minimized?: boolean;
	renderEmpty?: boolean;
	labels: Labels<"accessible" | "cooled" | "dangerousGoods" | "charger" | "none">;
}

export function BoxFeatures(props: BoxFeaturesProps) {
	const {
		accessible,
		cooled,
		dangerousGoods,
		charger,
		renderEmpty,
		minimized,
		labels,
	} = props;

	if (renderEmpty && !accessible && !cooled && !dangerousGoods) {
		return <span>{labels("none")}</span>;
	}
	return (
		<Stack direction="row" spacing={1}>
			{accessible && <Accessible label={labels("accessible")} minimized={minimized} />}
			{cooled && <AcUnit label={labels("cooled")} minimized={minimized} />}
			{dangerousGoods && <DangerousGood label={labels("dangerousGoods")} minimized={minimized} />}
			{charger && <Charger label={labels("charger")} minimized={minimized} />}
		</Stack>
	);
}

interface FlagProps {
	minimized?: boolean;
	label: string;
}

function Accessible({label, ...rest}: FlagProps) {
	const color = amber[800];
	return <FlagChip label={label} color={color} Icon={AccessibleIcon} {...rest} />;
}

function AcUnit({label, ...rest}: FlagProps) {
	return <FlagChip label={label} color={lightBlue["400"]} Icon={AcUnitIcon} {...rest} />;
}

function DangerousGood({label, ...rest}: FlagProps) {
	return <FlagChip label={label} color={red["400"]} Icon={WarningAmberIcon} {...rest} />;
}

function Charger({label, ...rest}: FlagProps) {
	return <FlagChip label={label} color={green["400"]} Icon={ChargerIcon} {...rest} />;
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
