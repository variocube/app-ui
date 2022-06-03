import React, {createContext, PropsWithChildren, useCallback, useContext, useMemo} from "react";
import {createTheme, CssBaseline, PaletteMode, ThemeProvider, useMediaQuery} from "@mui/material";
import {useStorage} from "../storage";

export type PrimaryColor = "orange" | "blue";

export enum Colors {
    white = "#ffffff",
    orange = "#EF881D",
    blue = "#05164d",
    success = "#4caf50",
    error = "#aa0000",
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
    primaryColor?: PrimaryColor;
}

export function VCThemeProvider({children, primaryColor = "orange"}: PropsWithChildren<VCThemeProviderProps>) {
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
                main: Colors[primaryColor],
                contrastText: Colors.white,
            },
            secondary: {
                main: Colors[primaryColor == "orange" ? "blue" : "orange"],
                contrastText: Colors.white,
            },
            success: {
                main: Colors.success,
                contrastText: Colors.white,
            },
            error: {
                main: Colors.error,
                contrastText: Colors.white,
            },
            background: {
                default: mode == "dark" ? "#222" : "#f6f6f6",
                paper: mode == "dark" ? "#2b2b2b" : "#fff"
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
    }), [primaryColor, mode]);

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