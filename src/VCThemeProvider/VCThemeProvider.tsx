import React, {createContext, PropsWithChildren, useCallback, useContext, useMemo} from "react";
import {createTheme, CssBaseline, PaletteMode, ThemeOptions, ThemeProvider, useMediaQuery} from "@mui/material";
import {useStorage} from "../storage";
import {RobotoFont} from "./RobotoFont";
import deepmerge from "deepmerge";
import {JetbrainsMonoFont} from "./JetbrainsMonoFont";

const DEFAULT_PRIMARY = "#ff6a00";
const DEFAULT_SECONDARY = "#009dd8";

const SUCCESS = {
	light: "#429945",
	dark: "#58cc5c"
}

const WARNING = {
	light: "#ccaa00",
	dark: "#e6bf00"
};

const ERROR = {
	light: "#aa0000",
	dark: "#e62e2e"
}

const INFO = {
	light: "#082480",
	dark: "#294fcc"
}

const BACKGROUND = {
	light: "#fffaf7",
	dark: "#15161a"
}

const PAPER = {
	light: "#ffffff",
	dark: "#282b33"
}

const TEXT = {
	light: "#282b33",
	dark: "#fdfaf7"
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

	const {
		colorPrimary: primary = DEFAULT_PRIMARY,
		colorSecondary: secondary = DEFAULT_SECONDARY
	} = branding ?? {};

    const theme = useMemo(() => {
        const themeOptions: ThemeOptions = {
            palette: {
                mode,
                primary: {
                    main: primary,
                },
                secondary: {
                    main: secondary,
                },
                success: {
                    main: SUCCESS[mode],
                },
                warning: {
                    main: WARNING[mode],
                },
                error: {
                    main: ERROR[mode],
                },
                info: {
                    main: INFO[mode],
                },
                text: {
                    primary: TEXT[mode],
                },
                background: {
					default: BACKGROUND[mode],
					paper: PAPER[mode]
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
                },
				MuiPaper: {
					styleOverrides: {
						root: {
							backgroundImage: "unset"
						}
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
