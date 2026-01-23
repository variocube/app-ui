import DarkModeIcon from "@mui/icons-material/Brightness4";
import LightModeIcon from "@mui/icons-material/Brightness7";
import {FormControlLabel, FormGroup, Switch} from "@mui/material";
import React, {useCallback} from "react";
import {usePaletteMode} from "./VCThemeProvider";

export const ThemeModeSwitcher = () => {
	const {mode, setMode} = usePaletteMode();

	const handleModeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setMode(e.currentTarget.checked ? "light" : "dark");
	}, [setMode]);

	return (
		<FormGroup sx={{display: "flex", flexDirection: "row"}}>
			<FormControlLabel
				control={<Switch checked={mode === "light"} onChange={handleModeChange} />}
				componentsProps={{typography: {lineHeight: "1em"}}}
				label={mode === "light" ? <LightModeIcon /> : <DarkModeIcon />}
			/>
		</FormGroup>
	);
};
