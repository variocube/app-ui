import {Autocomplete, TextField} from "@mui/material";
import React from "react";
import {findLocale, locales} from "./locales";

interface LocaleSelectProps {
	value?: string;
	onChange: (value?: string) => void;
	label: string;
	supportedLocales?: string[];
}

export function LocaleSelect({value, onChange, label, supportedLocales}: LocaleSelectProps) {
	const localesList = supportedLocales
		? locales
			.filter(l => supportedLocales.includes(l.code))
		: locales;
	return (
		<Autocomplete
			multiple={false}
			value={findLocale(value)}
			onChange={(_, locale) => onChange(locale?.code)}
			options={localesList}
			autoHighlight
			getOptionLabel={({label, code}) => `${label} (${code})`}
			renderOption={(props, option) => (
				<li {...props}>
					{option.labelLocal} ({option.code})
				</li>
			)}
			renderInput={(params) => (
				<TextField
					{...params}
					variant="outlined"
					label={label}
					inputProps={{
						...params.inputProps,
						autoComplete: "off", // disable autocomplete and autofill
					}}
				/>
			)}
		/>
	);
}
