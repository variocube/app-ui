import {Autocomplete, Box, TextField} from "@mui/material";
import React, {useCallback} from "react";
import {countries, countryToFlag, findCountry} from "./countries";

interface CountrySelectProps {
	value: string | undefined;
	onChange: (value?: string) => void;
	label: string;
}

export function CountrySelect({value, onChange, label}: CountrySelectProps) {
	return (
		<Autocomplete
			multiple={false}
			value={findCountry(value) || null}
			onChange={useCallback((event, country) => onChange(country?.code), [])}
			options={countries}
			autoHighlight
			getOptionLabel={(option) => option.label}
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
	);
}
