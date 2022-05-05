import React, {createContext, useContext} from "react";
import {FormControlLabel, FormGroup, PaletteMode, Switch} from "@mui/material";
import LightModeIcon from '@mui/icons-material/Brightness7';
import DarkModeIcon from '@mui/icons-material/Brightness4';

function getMode() {
    return (localStorage.getItem('vcAppUi.mode') || 'light') as PaletteMode;
}
function saveMode(mode: PaletteMode) {
    localStorage.setItem('vcAppUi.mode', mode);
}

const ThemeModeContext = createContext({
    mode: getMode(),
    setMode: (mode: PaletteMode) => saveMode(mode)
})
export const useMode = () => useContext(ThemeModeContext);

export const ThemeModeSwitcher = () => {
    const {mode, setMode} = useMode();

    const handleModeChange = () => {
        const m = mode === 'light' ? 'dark' : 'light';
        setMode(m);
        location.reload();
    }

    return (
        <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
            <FormControlLabel control={<Switch checked={mode === 'light'} onChange={handleModeChange} />}
                              componentsProps={{ typography: { lineHeight: '1em' }}}
                              label={mode === 'light' ? <LightModeIcon /> : <DarkModeIcon />}
            />
        </FormGroup>
    )
}