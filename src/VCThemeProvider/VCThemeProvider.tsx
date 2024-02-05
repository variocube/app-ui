import React, {createContext, PropsWithChildren, useCallback, useContext, useMemo} from "react";
import {createTheme, CssBaseline, PaletteMode, ThemeOptions, ThemeProvider, useMediaQuery} from "@mui/material";
import {useStorage} from "../storage";
import {RobotoFont} from "./RobotoFont";
import deepmerge from "deepmerge";
import {JetbrainsMonoFont} from "./JetbrainsMonoFont";

/**
 * Theme colors.
 */
export enum Colors {
    white = "#ffffff",
    orange = "#ff6a00",
    blue = "#009dd8",
    success = "#4caf50",
    errorLight = "#e62e2e",
    errorDark = "#aa0000",
    warning = "#da9500",
    infoLight = "#294fcc",
    infoDark = "#082480",
}

interface PaletteModeContextValue {
    mode: PaletteMode;
    setMode: (mode: PaletteMode) => any;
}

const PaletteModeContext = createContext<PaletteModeContextValue>({
    mode: "light",
    setMode: () => void 0,
});

interface VCThemeProviderProps {
    branding?: {
        colorPrimary?: string;
        colorSecondary?: string;
        muiThemeOptions?: ThemeOptions;
    }
}

export function VCThemeProvider({branding, children}: PropsWithChildren<VCThemeProviderProps>) {
    // Determine default mode based on user preference
    const userPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");
    const defaultMode = useMemo(() => userPrefersDark ? "dark" : "light", [userPrefersDark]);

    // Allow overriding the default mode
    const [modeOverride, setModeOverride] = useStorage<PaletteMode | null>("variocube-palette-mode", null);

    // Select actual mode to use
    const mode = useMemo(() => modeOverride ?? defaultMode, [modeOverride, defaultMode]);

    // Allows setting the mode override. Clears the storage item if the default mode is set.
    const setMode = useCallback((newMode: PaletteMode) => {
        setModeOverride(newMode != defaultMode ? newMode : null);
    }, [defaultMode]);

    const theme = useMemo(() => {
        const themeOptions: ThemeOptions = {
            palette: {
                mode,
                primary: {
                    main: branding?.colorPrimary || Colors.orange,
                    contrastText: Colors.white,
                },
                secondary: {
                    main: branding?.colorSecondary || Colors.blue,
                    contrastText: Colors.white,
                },
                success: {
                    main: Colors.success,
                    contrastText: Colors.white,
                },
                warning: {
                    main: Colors.warning,
                    contrastText: Colors.white,
                },
                error: {
                    main: mode == "light" ? Colors.errorDark : Colors.errorLight,
                    contrastText: Colors.white,
                },
                info: {
                    main: mode == "light" ? Colors.infoDark : Colors.infoLight,
                    contrastText: Colors.white,
                },
                text: {
                    primary: mode == "dark" ? "#fdfaf7" : "#282b33",
                },
                background: {
                    default: mode == "dark" ? "#15161a" : "#fffaf7",
                    paper: mode == "dark" ? "#282b33" : "#fff"
                }
            },
            typography: {
                h1: {
                    fontSize: 46,
                    fontWeight: 300,
                },
                h2: {
                    fontSize: 29,
                    fontWeight: 500,
                },
                h3: {
                    fontSize: 24,
                    fontWeight: 500,
                },
                h4: {
                    fontSize: 20,
                    fontWeight: 500,
                },
                h5: {
                    fontSize: 18,
                    fontWeight: 500,
                },
                h6: {
                    fontSize: 18,
                    fontWeight: 500,
                },
                overline: {
                    fontWeight: 500,
                }
            },
            components: {
                MuiLink: {
                    defaultProps: {
                        underline: "hover"
                    }
                }
            }
        };
        return createTheme(deepmerge(themeOptions, branding?.muiThemeOptions || {}));
    }, [mode, branding]);

    return (
        <ThemeProvider theme={theme}>
            <PaletteModeContext.Provider value={{mode, setMode}}>
                <CssBaseline/>
                <RobotoFont/>
                <JetbrainsMonoFont/>
                {children}
            </PaletteModeContext.Provider>
        </ThemeProvider>
    )
}

export function usePaletteMode() {
    const value = useContext(PaletteModeContext);
    if (!value) {
        throw new Error("Could not find palette mode context. Are you missing a VCThemeProvider in your component tree?");
    }
    return value;
}
