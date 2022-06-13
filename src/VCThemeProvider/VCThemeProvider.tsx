import React, {createContext, PropsWithChildren, useCallback, useContext, useMemo} from "react";
import {createTheme, CssBaseline, PaletteMode, ThemeProvider, useMediaQuery} from "@mui/material";
import {useStorage} from "../storage";

/**
 * Theme colors.
 */
export enum Colors {
    white = "#ffffff",
    orange = "#ff6a00",
    blue = "#009dd8",
    success = "#4caf50",
    error = "#aa0000",
    warning = "#da9500",
    info = "#05164d",
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
}

export function VCThemeProvider({children}: PropsWithChildren<VCThemeProviderProps>) {
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

    const theme = useMemo(() => createTheme({
        palette: {
            mode,
            primary: {
                main: Colors.orange,
                contrastText: Colors.white,
            },
            secondary: {
                main: Colors.blue,
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
                main: Colors.error,
                contrastText: Colors.white,
            },
            info: {
                main: Colors.info,
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
    }), [mode]);

    return (
        <ThemeProvider theme={theme}>
            <PaletteModeContext.Provider value={{mode, setMode}}>
                <CssBaseline/>
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