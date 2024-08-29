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
}

export function RadioGroup<T extends string>(props: RadioGroupProps<T>) {
	const {label, value, onChange, options, renderLabel, ...radioGroupProps} = props;

	return (
		<FormControl>
			{label && <FormLabel>{label}</FormLabel>}
			<MuiRadioGroup value={value} onChange={(_, value) => onChange(value as T)} {...radioGroupProps}>
				{options.map(option => (
					<FormControlLabel
						key={option}
						control={<Radio value={option} />}
						label={renderLabel ? renderLabel(option) : option}
					/>
				))}
			</MuiRadioGroup>
		</FormControl>
	);
}
