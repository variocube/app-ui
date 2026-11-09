import DarkModeIcon from "@mui/icons-material/Brightness4";
import LightModeIcon from "@mui/icons-material/Brightness7";
import {FormControlLabel, FormGroup, Switch} from "@mui/material";
import React, {useCallback} from "react";
import {usePaletteMode} from "./VCThemeProvider";

/**
 * Switches between light and dark mode. Renders nothing when only one mode is supported (a branding v2 with one mode).
 */
export const ThemeModeSwitcher = () => {
	const {mode, setMode, supportedModes} = usePaletteMode();

	const handleModeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setMode(e.currentTarget.checked ? "light" : "dark");
	}, [setMode]);

	if (supportedModes.length < 2) {
		return null;
	}

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
