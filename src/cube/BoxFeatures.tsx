import {SvgIconComponent} from "@mui/icons-material";
import AccessibleIcon from "@mui/icons-material/Accessible";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ChargerIcon from '@mui/icons-material/ChargingStation';
import {Chip, Tooltip, useTheme} from "@mui/material";
import {blue, lightBlue, red, yellow} from "@mui/material/colors";
import React, {Fragment} from "react"; 

export interface BoxFeaturesProps { box: Box, minimized?: boolean, renderEmpty?: boolean, t: Function }

export function BoxFeatures({box: { accessible, cooled, dangerousGoods, charger }, minimized, renderEmpty, t}: BoxFeaturesProps) {
	if (renderEmpty && !accessible && !cooled && !dangerousGoods) return <span>None</span>;
	const flagProps = { minimized, t };
	return (
		<Fragment>
			{accessible && <Accessible {...flagProps} />}
			{cooled && <AcUnit {...flagProps} />}
			{dangerousGoods && <DangerousGood {...flagProps} />}
			{charger && <Charger {...flagProps} />}
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
	charger: boolean;
}


interface FlagProps {
	minimized?: boolean;
	t?:Function
}

function Accessible(props: FlagProps) { 
	const theme = useTheme();
	const color = theme.palette.mode == "dark" ? yellow["400"] : blue["700"];
	const label = props.t?props.t('BoxType.Accessible'):'Accessible';
	return <FlagChip label={label} color={color} Icon={AccessibleIcon} {...props} />;
}

function AcUnit(props: FlagProps) {
	const label = props.t?props.t('BoxType.Cooled'):'Cooled';
	return <FlagChip label={label} color={lightBlue["400"]} Icon={AcUnitIcon} {...props} />;
}

function DangerousGood(props: FlagProps) {
	const label = props.t?props.t('BoxType.Dangerous Goods'):'Dangerous Goods';
	return <FlagChip label={label} color={red['400']} Icon={WarningAmberIcon} {...props} />;
}

function Charger(props: FlagProps) {
	const label = props.t?props.t('BoxType.Charger'):'Charger';
	return <FlagChip label={label} color={red['400']} Icon={ChargerIcon} {...props} />;
}

interface FlagChipProps extends FlagProps {
	label: string;
	color: string;
	Icon: SvgIconComponent
}

function FlagChip({label, color, Icon, minimized}: FlagChipProps) {
	return (
		<Tooltip title={minimized ? label : ''} placement="top">
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
