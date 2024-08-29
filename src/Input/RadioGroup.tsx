import {
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup as MuiRadioGroup,
	RadioGroupProps as MuiRadioGroupProps,
} from "@mui/material";
import React, {ReactNode} from "react";

interface RadioGroupProps<T extends string> extends Omit<MuiRadioGroupProps, "value" | "onChange" | "children"> {
	label?: ReactNode;
	value: T | undefined;
	onChange: (value: T) => any;
	options: Record<T, ReactNode>;
}

export function RadioGroup<T extends string>(props: RadioGroupProps<T>) {
	const {label, value, onChange, options, ...radioGroupProps} = props;

	return (
		<FormControl>
			{label && <FormLabel>{label}</FormLabel>}
			<MuiRadioGroup value={value} onChange={(_, value) => onChange(value as T)} {...radioGroupProps}>
				{Object.entries(options).map(([value, label]) => (
					<FormControlLabel key={value} control={<Radio value={value} />} label={label} />
				))}
			</MuiRadioGroup>
		</FormControl>
	);
}
