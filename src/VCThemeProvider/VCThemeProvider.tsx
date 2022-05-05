import React, {PropsWithChildren} from "react";
import {createTheme, CssBaseline, darken, lighten, Palette, PaletteMode, ThemeProvider} from "@mui/material";
import {light} from "@mui/material/styles/createPalette";

const theme = createTheme({
    palette: {
        primary: {
            main: '#05174d'
        },
        secondary: {
            main: '#ff6900'
        }
    }
})

const getModePalette = (mode: PaletteMode) => ({
    mode,
    ...(mode === 'light' ?
            {
                background: {
                    default: '#efefef',
                    paper: '#fff'
                },
            } :
            {
                background: {
                    default: '#555',
                    paper: '#222'
                },
                primary: {
                    main: '#2756FF',
                    light: lighten('#2756FF', 0.3),
                    dark: darken('#2756FF', 0.5)
                },
                text: {
                    primary: '#c2c2c2',
                    secondary: '#dadada',
                },
            }
    )
}) as Palette

const getModeComponents = (mode: PaletteMode) => ({
    mode,
    ...(mode === 'light') ?
        {

        } :
        {
            MuiSvgIcon: {
                styleOverrides: {
                    root: {
                        color: '#c2c2c2 !important'
                    }
                }
            }
        }
}) as typeof theme.components;

export const VCThemeProvider = ({mode, children}: PropsWithChildren<{ mode?: 'light'|'dark' }>) => {
    mode = mode || 'light';
    theme.palette = { ...theme.palette, ...getModePalette(mode) };
    theme.components = { ...theme.palette, ...getModeComponents(mode) };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            {children}
        </ThemeProvider>
    )
}