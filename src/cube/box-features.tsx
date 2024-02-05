import {SvgIconComponent} from "@mui/icons-material";
import AccessibleIcon from "@mui/icons-material/Accessible";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ChargerIcon from '@mui/icons-material/ChargingStation';
import {Chip, Tooltip, useTheme} from "@mui/material";
import {amber, blue, green, lightBlue, red, yellow} from "@mui/material/colors";
import React, {Fragment} from "react";

type TFunction = (key: 'boxTypes.Accessible'|'boxTypes.Cooled'|'boxTypes.DangerousGoods'|'boxTypes.Charger'|'None') => string;

interface BoxFeaturesProps {
	accessible: boolean;
	cooled: boolean;
	dangerousGoods: boolean;
	charger: boolean;
	minimized?: boolean,
	renderEmpty?: boolean,
	t?: TFunction;
}

export function BoxFeatures(props: BoxFeaturesProps) {
	const {
		accessible,
		cooled,
		dangerousGoods,
		charger,
		renderEmpty,
		...rest
	} = props;

	if (renderEmpty && !accessible && !cooled && !dangerousGoods) {
		const label = props.t ? props.t('None') : 'None';
		return <span>{label}</span>;
	}
	return (
		<Fragment>
			{accessible && <Accessible {...rest} />}
			{cooled && <AcUnit {...rest} />}
			{dangerousGoods && <DangerousGood {...rest} />}
			{charger && <Charger {...rest} />}
		</Fragment>
	);
}

interface FlagProps {
	minimized?: boolean;
	t?: TFunction
}

function Accessible({ t, ...rest }: FlagProps) {
	const theme = useTheme();
	const color = amber[800];
	const label = t ? t('boxTypes.Accessible') : 'Accessible';
	return <FlagChip label={label} color={color} Icon={AccessibleIcon} {...rest} />;
}

function AcUnit({ t, ...rest }: FlagProps) {
	const label = t ? t('boxTypes.Cooled') : 'Cooled';
	return <FlagChip label={label} color={lightBlue["400"]} Icon={AcUnitIcon} {...rest} />;
}

function DangerousGood({ t, ...rest }: FlagProps) {
	const label = t ? t('boxTypes.DangerousGoods') : 'Dangerous Goods';
	return <FlagChip label={label} color={red['400']} Icon={WarningAmberIcon} {...rest} />;
}

function Charger({ t, ...rest }: FlagProps) {
	const label = t ? t('boxTypes.Charger') : 'Charger';
	return <FlagChip label={label} color={green['400']} Icon={ChargerIcon} {...rest} />;
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
