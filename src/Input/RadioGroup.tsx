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
	options: ReadonlyArray<T>;
	renderLabel?: (option: T) => ReactNode;
	required?: boolean;
}

export function RadioGroup<T extends string>(props: Readonly<RadioGroupProps<T>>) {
	const {label, value, onChange, options, renderLabel, required, ...radioGroupProps} = props;

	return (
		<FormControl required={required}>
			{label && <FormLabel>{label}</FormLabel>}
			<MuiRadioGroup value={value} onChange={(_, value) => onChange(value as T)} {...radioGroupProps}>
				{options.map(option => (
					<FormControlLabel
						key={option}
						control={<Radio required={required} value={option} />}
						label={renderLabel ? renderLabel(option) : option}
					/>
				))}
			</MuiRadioGroup>
		</FormControl>
	);
}
