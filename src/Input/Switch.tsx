import {FormControlLabel, Switch as MuiSwitch, SwitchProps as MuiSwitchProps} from "@mui/material";
import React, {useCallback} from "react";

export type SwitchProps = Omit<MuiSwitchProps, "onChange" | "value"> & {
	label: string;
	value?: boolean;
	onChange?: (checked: boolean) => any;
	className?: string;
};

export const Switch = ({label, value, onChange, disabled, className, color, ...props}: SwitchProps) => {
	const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		if (onChange) {
			onChange(e.target.checked);
		}
	}, [onChange]);

	return (
		<FormControlLabel
			control={
				<MuiSwitch
					checked={value}
					onChange={handleChange}
					disabled={disabled}
					{...props}
				/>
			}
			label={label}
			disabled={disabled}
			className={className}
		/>
	);
};
