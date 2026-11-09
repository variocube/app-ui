import {
	createTheme,
	CssBaseline,
	decomposeColor,
	PaletteMode,
	ThemeOptions,
	ThemeProvider,
	useMediaQuery,
} from "@mui/material";
import deepmerge from "deepmerge";
import React, {createContext, PropsWithChildren, useCallback, useContext, useMemo} from "react";
import {useStorage} from "../storage";
import {BrandingV2, createBrandingV2Theme, getBrandingV2Modes, selectPaletteMode} from "./brandingV2";
import {JetbrainsMonoFont} from "./JetbrainsMonoFont";
import {RobotoFont} from "./RobotoFont";
import {createVariocubeThemeOptions, DEFAULT_PRIMARY, DEFAULT_SECONDARY, mergeThemeOptions} from "./variocubeTheme";

interface ThemeContextValue {
	mode: PaletteMode;
	setMode: (mode: PaletteMode) => any;
	supportedModes: readonly PaletteMode[];
	customLogo?: CustomLogo;
}

export interface CustomLogo {
	paddingX?: number | null;
	paddingY?: number | null;
	url: string;
}

const BOTH_MODES: readonly PaletteMode[] = ["light", "dark"];

const ThemeContext = createContext<ThemeContextValue>({
	mode: "light",
	setMode: () => void 0,
	supportedModes: BOTH_MODES,
});

export interface Branding {
	colorPrimary?: string;
	colorSecondary?: string;
	muiThemeOptions?: ThemeOptions;
	logoPaddingX?: number | null;
	logoPaddingY?: number | null;
	logoLightUrl?: string;
	logoDarkUrl?: string;
}

export interface VCThemeProviderProps {
	/** Branding v1: colours, logos and raw MUI theme options. Ignored when `brandingV2` is given. */
	branding?: Branding;
	/**
	 * Branding v2: the theme, the supported modes and the logo per mode. Takes precedence over `branding`.
	 * `null`/`undefined`, or a branding without any mode, means none.
	 */
	brandingV2?: BrandingV2 | null;
	/**
	 * Skips the system's `prefers-color-scheme` in the mode selection, for devices that report a preference nobody
	 * chose (e.g. Chromium on a kiosk reports `light` without an OS preference). The mode is then the stored choice,
	 * else the default mode: branding v2's `defaultMode`, or `light`.
	 */
	ignoreSystemMode?: boolean;
	/**
	 * Theme options merged over the built theme of either branding version (objects merge, arrays and other values,
	 * style functions included, replace). Keep it stable: a new object on every render rebuilds the theme every time.
	 */
	themeOptions?: ThemeOptions;
}

export function VCThemeProvider(props: PropsWithChildren<VCThemeProviderProps>) {
	const {branding, brandingV2: brandingV2Prop, ignoreSystemMode, themeOptions, children} = props;
	const brandingV2Modes = useMemo(() => brandingV2Prop ? getBrandingV2Modes(brandingV2Prop) : [], [brandingV2Prop]);
	const brandingV2 = brandingV2Prop && brandingV2Modes.length > 0 ? brandingV2Prop : undefined;
	const supportedModes = brandingV2 ? brandingV2Modes : BOTH_MODES;

	// The system's preference. Neither query matches where the browser does not support it.
	const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");
	const systemPrefersLight = useMediaQuery("(prefers-color-scheme: light)");
	const systemMode = ignoreSystemMode ? undefined : toPaletteMode(systemPrefersDark, systemPrefersLight);

	// The mode shown when the user has not chosen one.
	const automaticMode = selectPaletteMode({
		supportedModes,
		systemMode,
		defaultMode: brandingV2?.defaultMode ?? "light",
	});

	// Allow overriding the automatic mode
	const [modeOverride, setModeOverride] = useStorage<PaletteMode | null>("variocube-palette-mode", null);

	// Select actual mode to use. A stored mode the branding does not support is ignored, but kept.
	const mode = selectPaletteMode({supportedModes, storedMode: modeOverride, defaultMode: automaticMode});

	// Allows setting the mode override. Records `null` when the mode the user picked is the one the mode would be
	// anyway, so that it follows that again: for v1 the automatic mode (the system preference, else light); for v2
	// only a known system preference, so that a choice survives a branding with another default mode. A mode that is
	// not supported is not set.
	const followedMode = brandingV2 ? systemMode : automaticMode;
	const setMode = useCallback((newMode: PaletteMode) => {
		if (supportedModes.includes(newMode)) {
			setModeOverride(newMode != followedMode ? newMode : null);
		}
	}, [supportedModes, followedMode, setModeOverride]);

	const {
		colorPrimary,
		colorSecondary,
		logoLightUrl,
		logoDarkUrl,
		logoPaddingX,
		logoPaddingY,
	} = branding ?? {};

	const theme = useMemo(() => {
		if (brandingV2) {
			return createBrandingV2Theme(brandingV2, mode, themeOptions);
		}
		const themeOptionsV1 = deepmerge(
			createVariocubeThemeOptions(
				mode,
				sanitizeColor(colorPrimary, DEFAULT_PRIMARY),
				sanitizeColor(colorSecondary, DEFAULT_SECONDARY),
			),
			branding?.muiThemeOptions || {},
		);
		return createTheme(themeOptions ? mergeThemeOptions(themeOptionsV1, themeOptions) : themeOptionsV1);
	}, [mode, branding, brandingV2, themeOptions]);

	const customLogo = useMemo(() => {
		if (brandingV2) {
			// Each v2 mode has the logo that reads on its background: no fallback to the other mode's.
			const logoUrl = brandingV2[mode]?.logoUrl;
			return typeof logoUrl == "string" && logoUrl ? {url: logoUrl} : undefined;
		}
		const logoUrl = mode == "light" ? (logoLightUrl || logoDarkUrl) : (logoDarkUrl || logoLightUrl);
		if (logoUrl) {
			return {
				url: logoUrl,
				paddingX: logoPaddingX,
				paddingY: logoPaddingY,
			};
		}
	}, [brandingV2, logoLightUrl, logoDarkUrl, mode, logoPaddingX, logoPaddingY]);

	const contextValue = useMemo(() => ({mode, setMode, supportedModes, customLogo}), [
		mode,
		setMode,
		supportedModes,
		customLogo,
	]);

	return (
		<ThemeProvider theme={theme}>
			<ThemeContext.Provider value={contextValue}>
				<CssBaseline />
				<RobotoFont />
				<JetbrainsMonoFont />
				{children}
			</ThemeContext.Provider>
		</ThemeProvider>
	);
}

function toPaletteMode(prefersDark: boolean, prefersLight: boolean): PaletteMode | undefined {
	if (prefersDark) {
		return "dark";
	}
	return prefersLight ? "light" : undefined;
}

function sanitizeColor(color: string | undefined, fallback: string) {
	try {
		if (color) {
			decomposeColor(color);
			return color;
		}
	}
	catch (error) {
	}
	return fallback;
}

/**
 * The active mode, the setter of the user's choice (a no-op for a mode that is not supported) and the supported
 * modes: both, unless a branding v2 supports only one.
 */
export function usePaletteMode() {
	const value = useContext(ThemeContext);
	if (!value) {
		throw new Error("Could not find theme context. Are you missing a VCThemeProvider in your component tree?");
	}
	const {mode, setMode, supportedModes} = value;
	return {mode, setMode, supportedModes};
}

export function useCustomLogo() {
	const value = useContext(ThemeContext);
	if (!value) {
		throw new Error("Could not find theme context. Are you missing a VCThemeProvider in your component tree?");
	}
	return value.customLogo;
}
