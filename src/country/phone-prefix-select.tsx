import {Autocomplete, Box, TextField} from "@mui/material";
import {countries, countryToFlag, findCountryByPhoneCode} from "./countries";
import React from "react";

interface PhonePrefixSelect {
	label: string;
	value: string|null;
	onChange: (code: string|null) => void;
	disabled?: boolean;
}

export function PhonePrefixSelect({label, value, onChange, disabled = false}: PhonePrefixSelect) {

	return (
		<Autocomplete
			disabled={disabled}
			multiple={false}
			value={findCountryByPhoneCode(value)}
			onChange={(_, country) => onChange(country?.phone || null)}
			options={countries}
			autoHighlight
			getOptionLabel={(option) => `${countryToFlag(option.code)} ${option.code} (+${option.phone})`}
			renderOption={(props, option) => (
				<li {...props}>
					<Box
						sx={{
							display: "inline-block",
							fontSize: "1.25em",
							marginRight: 1,
						}}
					>
						{countryToFlag(option.code)}
					</Box>
					<span>{option.label} ({option.code}) +{option.phone}</span>
				</li>
			)}
			renderInput={(params) => (
				<TextField
					{...params}
					variant="outlined"
					label={label}
					inputProps={{
						...params.inputProps,
						autoComplete: "new-password", // disable autocomplete and autofill
					}}
				/>
			)}
		/>
	)
}
