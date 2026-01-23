import {MenuItem} from "@mui/material";
import React, {PropsWithChildren} from "react";
import {TextField, TextFieldProps} from "./TextField";

type SelectorProps = TextFieldProps & {
	options: { label: string; value: string }[];
};

export const Selector = ({fullWidth = true, options, ...props}: PropsWithChildren<SelectorProps>) => {
	return (
		<TextField
			{...props}
			select
			fullWidth={fullWidth}
		>
			{options.map((o, i) => (
				<MenuItem key={"select-item-" + o.value + "-" + i} value={o.value}>{o.label}</MenuItem>
			))}
		</TextField>
	);
};
