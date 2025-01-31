import {MenuItem} from "@mui/material";
import React, {ReactNode} from "react";
import {TextField, TextFieldProps} from "./TextField";

interface SelectProps<T extends string | number> extends Omit<TextFieldProps, "value" | "onChange" | "children"> {
	label?: ReactNode;
	value: T | undefined;
	onChange: (value: T) => any;
	options: ReadonlyArray<T>;
	renderLabel?: (option: T) => ReactNode;
}

export function Select<T extends string>(props: Readonly<SelectProps<T>>) {
	const {label, value, onChange, options, renderLabel, ...rest} = props;
	return (
		<TextField
			select
			label={label}
			value={value}
			onChange={(value) => onChange(value as T)}
			{...rest}
		>
			{options.map(option => (
				<MenuItem
					key={option}
					value={option}
				>
					{renderLabel ? renderLabel(option) : option}
				</MenuItem>
			))}
		</TextField>
	);
}
