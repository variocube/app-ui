import {IconButton, InputAdornment} from "@mui/material";
import * as React from "react";
import {FormEvent, useEffect, useState} from "react";
import {SearchIcon} from "../icons";
import {TextField, TextFieldProps} from "../Input/TextField";

export type SearchFormProps = Omit<TextFieldProps, "value" | "onChange" | "InputProps"> & {
	search?: string;
	onSearch: (search: string) => void;
};

export function SearchForm(props: SearchFormProps) {
	const {
		search,
		onSearch,
		...rest
	} = props;

	const [value, setValue] = useState(search || "");

	useEffect(() => {
		if (search) {
			setValue(value);
		}
	}, [search]);

	function handleSubmit(e: FormEvent) {
		e.preventDefault();
		onSearch(value);
	}

	return (
		<form onSubmit={handleSubmit}>
			<TextField
				value={value}
				onChange={setValue}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton type="submit" size="large">
								<SearchIcon />
							</IconButton>
						</InputAdornment>
					),
				}}
				{...rest}
			/>
		</form>
	);
}
