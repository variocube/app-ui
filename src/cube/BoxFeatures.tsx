import {SvgIconComponent} from "@mui/icons-material";
import AccessibleIcon from "@mui/icons-material/Accessible";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {Chip, Tooltip, useTheme} from "@mui/material";
import {blue, lightBlue, red, yellow} from "@mui/material/colors";
import React, {Fragment} from "react";

export function BoxFeatures({box: { accessible, cooled, dangerousGoods }, minimized, renderEmpty}: { box: Box, minimized?: boolean, renderEmpty?: boolean }) {
	if (renderEmpty && !accessible && !cooled && !dangerousGoods) return <span>None</span>;
	const flagProps = { minimized };
	return (
		<Fragment>
			{accessible && <Accessible {...flagProps} />}
			{cooled && <AcUnit {...flagProps} />}
			{dangerousGoods && <DangerousGood {...flagProps} />}
		</Fragment>
	);
}

export interface Box {
	number: string;
	created: string;
	updated: string;
	types: string[];
	apps: string[];
	lock: string;
	secondaryLock: string;
	disabled: boolean;
	maxOccupancies: number;
	description: string;
	accessible: boolean;
	cooled: boolean;
	dangerousGoods: boolean;
}


interface FlagProps {
	minimized?: boolean;
}

function Accessible(props: FlagProps) {
	const theme = useTheme();
	const color = theme.palette.mode == "dark" ? yellow["400"] : blue["700"];
	return <FlagChip label="Accessible" color={color} Icon={AccessibleIcon} {...props} />;
}

function AcUnit(props: FlagProps) {
	return <FlagChip label="Cooled" color={lightBlue["400"]} Icon={AcUnitIcon} {...props} />;
}

function DangerousGood(props: FlagProps) {
	return <FlagChip label="Dangerous Goods" color={red['400']} Icon={WarningAmberIcon} {...props} />;
}

interface FlagChipProps extends FlagProps {
	label: string;
	color: string;
	Icon: SvgIconComponent
}

function FlagChip({label, color, Icon, minimized}: FlagChipProps) {
	return (
		<Tooltip title={minimized ? label : undefined} placement="top">
			<Chip
				sx={{
					borderColor: color,
					color,
					"&.MuiChip-root .MuiChip-icon": {
						color,
					},
					"&.MuiChip-root .MuiChip-label": {
						paddingLeft: minimized ? 0 : undefined
					},
				}}
				variant="outlined"
				icon={<Icon />}
				label={!minimized ? label : undefined}
			/>
		</Tooltip>
	);
}
