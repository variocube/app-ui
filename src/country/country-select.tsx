import {Autocomplete, Box, TextField} from "@mui/material";
import React from "react";
import {countries, countryToFlag, findCountry} from "./countries";

interface CountrySelectProps {
	value: string | null;
	onChange: (value: string | null) => void;
	label: string;
}

export function CountrySelect({value, onChange, label}: CountrySelectProps) {

	return (
		<Autocomplete
			multiple={false}
			value={findCountry(value) || null}
			onChange={(e, country) => onChange(country?.code || null)}
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
