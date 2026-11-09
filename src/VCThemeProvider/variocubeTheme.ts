import {PaletteMode, ThemeOptions} from "@mui/material";
import deepmerge from "deepmerge";

/**
 * The Variocube look that `VCThemeProvider` builds both branding versions on. Internal: not exported from the
 * package index.
 */

export const DEFAULT_PRIMARY = "#ff6a00";
export const DEFAULT_SECONDARY = "#009dd8";

const SUCCESS = {
	light: "#429945",
	dark: "#58cc5c",
};

const WARNING = {
	light: "#ccaa00",
	dark: "#e6bf00",
};

const ERROR = {
	light: "#aa0000",
	dark: "#e62e2e",
};

const INFO = {
	light: "#082480",
	dark: "#294fcc",
};

export const BACKGROUND = {
	light: "#fffaf7",
	dark: "#15161a",
};

export const PAPER = {
	light: "#ffffff",
	dark: "#282b33",
};

const TEXT = {
	light: "#282b33",
	dark: "#fdfaf7",
};

/**
 * The Variocube theme options for a mode with the given accent colours. The colours must already be valid.
 */
export function createVariocubeThemeOptions(mode: PaletteMode, primary: string, secondary: string): ThemeOptions {
	return {
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
				paper: PAPER[mode],
			},
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
			},
		},
		components: {
			MuiLink: {
				defaultProps: {
					underline: "hover",
				},
			},
			MuiPaper: {
				styleOverrides: {
					root: {
						// MUI tints elevated paper in dark mode with a white gradient; the Variocube look has none.
						backgroundImage: "unset",
					},
				},
			},
		},
	};
}

/**
 * Merges theme options over others: objects merge, arrays and all other values (including style functions) replace.
 */
export function mergeThemeOptions(target: ThemeOptions, source: ThemeOptions): ThemeOptions {
	return deepmerge<ThemeOptions>(target, source, {arrayMerge: (_target, sourceArray) => sourceArray});
}
