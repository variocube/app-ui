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
    logoLightUrl? : string,
    setLogoLightUrl : (logoLightUrl: string | undefined) => void,
    logoDarkUrl? : string,
    setLogoDarkUrl : (logoDarkUrl: string | undefined) => void,
    logoPaddingX? : number | null,
    setLogoPaddingX : (logoPaddingX: number | null) => void,
    logoPaddingY? : number | null,
    setLogoPaddingY : (logoPaddingY: number | null) => void,
    colorPrimary : string,
    setColorPrimary : (colorPrimary: string) => void,
    colorSecondary : string,
    setColorSecondary : (colorPrimary: string) => void
}

const PaletteModeContext = createContext<PaletteModeContextValue>({
    mode: "light",
    setMode: () => void 0,
    logoLightUrl : "",
    setLogoLightUrl: () => void 0,
    logoDarkUrl : "",
    setLogoDarkUrl: () => void 0,
    logoPaddingX: 0,
    setLogoPaddingX: () => void 0,
    logoPaddingY: 0,
    setLogoPaddingY: () => void 0,
    colorPrimary : DEFAULT_PRIMARY,
    setColorPrimary: () => void 0,
    colorSecondary : DEFAULT_SECONDARY,
    setColorSecondary: () => void 0
});

interface VCThemeProviderProps {
    branding?: {
        colorPrimary?: string;
        colorSecondary?: string;
        muiThemeOptions?: ThemeOptions;
        logoPaddingX?: number | null;
        logoPaddingY?: number | null;
        logoLightUrl?: string;
        logoDarkUrl?: string;
    }
}

export function VCThemeProvider({branding, children}: PropsWithChildren<VCThemeProviderProps>) {

    const [colorPrimary, setColorPrimary] = React.useState(branding?.colorPrimary || DEFAULT_PRIMARY);
    const [colorSecondary, setColorSecondary] = React.useState(branding?.colorSecondary || DEFAULT_SECONDARY);
    const [logoLightUrl, setLogoLightUrl] = React.useState(branding?.logoLightUrl);
    const [logoDarkUrl, setLogoDarkUrl] = React.useState(branding?.logoDarkUrl);
    const [logoPaddingX, setLogoPaddingX] = React.useState<number | null>(branding?.logoPaddingX || 0);
    const [logoPaddingY, setLogoPaddingY] = React.useState<number | null>(branding?.logoPaddingY || 0);

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

    const isColor = (strColor : string) => {
        const s = new Option().style;
        s.color = strColor;
        return s.color !== '';
      }

	const {
		colorPrimary: primary = isColor(colorPrimary) ? colorPrimary : DEFAULT_PRIMARY,
		colorSecondary: secondary = isColor(colorSecondary) ? colorSecondary : DEFAULT_SECONDARY
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
    }, [mode, branding, colorPrimary, colorSecondary]);

    return (
        <ThemeProvider theme={theme}>
            <PaletteModeContext.Provider value={{mode, setMode, 
                colorPrimary, setColorPrimary, colorSecondary, setColorSecondary,
                logoDarkUrl, setLogoDarkUrl, logoLightUrl, setLogoLightUrl,
                logoPaddingX, setLogoPaddingX, logoPaddingY, setLogoPaddingY}}>
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
