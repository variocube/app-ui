import {AlertProps, createTheme, CSSObject, PaletteMode, PaperProps, Theme, ThemeOptions} from "@mui/material";
import {
	BACKGROUND,
	createVariocubeThemeOptions,
	DEFAULT_PRIMARY,
	DEFAULT_SECONDARY,
	mergeThemeOptions,
	PAPER,
} from "./variocubeTheme";

/**
 * Branding v2 as Center serves it (`GET /api/app/v2/tenants/{tenantId}/branding/v2`). The canonical contract is
 * Center's (variocube/center#518); this type mirrors its JSON exactly.
 */
export interface BrandingV2 {
	/** Corner radius in px for buttons, cards, fields and the like, 0..24. */
	borderRadius: number;
	/**
	 * Corner radius of buttons alone (`Button`, `ButtonGroup`, `ToggleButton`, `ToggleButtonGroup`): 0..24 px, or
	 * 999 for fully rounded (pill) buttons at any height. Absent or `null`, buttons follow `borderRadius`.
	 */
	buttonBorderRadius?: number | null;
	/** Whether cards and tiles cast a shadow. Without, they are flat. */
	shadows: boolean;
	/** Whether cards and tiles have an outline in the mode's divider colour, independent of `shadows`. */
	outlines: boolean;
	/** The mode used where nothing else decides (see `selectPaletteMode`). Names a mode that is set. */
	defaultMode: PaletteMode;
	light: BrandingV2Mode | null;
	dark: BrandingV2Mode | null;
	/** One image for both modes, scaled to cover the screen and cut off away from its anchor. */
	backgroundImage: BrandingV2BackgroundImage | null;
}

/** The colours and logo of one mode. Colours are `#rrggbb`, case-insensitive. */
export interface BrandingV2Mode {
	primary: string;
	/** Absent or `null`: the theme uses the mode's primary colour as the secondary one. */
	secondary?: string | null;
	/** The page background. */
	background: string;
	/** The background of cards and tiles: `#rrggbb` or, translucent so a background image shows through, `#rrggbbaa`. */
	surface: string;
	/** The logo that reads on this mode's background, an absolute http(s) URL. */
	logoUrl: string | null;
}

export interface BrandingV2BackgroundImage {
	/** An absolute http(s) URL. */
	url: string;
	anchor: BrandingV2Anchor;
}

/** The nine anchors of a background image, in reading order of the 3 × 3 grid. */
export const BRANDING_V2_ANCHORS = [
	"top-left",
	"top",
	"top-right",
	"left",
	"center",
	"right",
	"bottom-left",
	"bottom",
	"bottom-right",
] as const;

/** The part of a background image that stays visible when it is cut off to cover the screen. */
export type BrandingV2Anchor = typeof BRANDING_V2_ANCHORS[number];

export const DEFAULT_BRANDING_V2_ANCHOR: BrandingV2Anchor = "center";

const BACKGROUND_POSITIONS: Record<BrandingV2Anchor, string> = {
	"top-left": "left top",
	"top": "center top",
	"top-right": "right top",
	"left": "left center",
	"center": "center center",
	"right": "right center",
	"bottom-left": "left bottom",
	"bottom": "center bottom",
	"bottom-right": "right bottom",
};

/**
 * The CSS `background-position` (or `object-position` of an `<img>`) for an anchor, to be used with
 * `background-size: cover` (`object-fit: cover`). A missing or unknown anchor is the default, `center`.
 */
export function brandingV2BackgroundPosition(anchor: BrandingV2Anchor | null | undefined): string {
	return anchor && Object.prototype.hasOwnProperty.call(BACKGROUND_POSITIONS, anchor)
		? BACKGROUND_POSITIONS[anchor]
		: BACKGROUND_POSITIONS[DEFAULT_BRANDING_V2_ANCHOR];
}

const PALETTE_MODES: readonly PaletteMode[] = ["light", "dark"];

/** The modes a branding supports, light before dark. Empty for a branding without any mode, which is invalid. */
export function getBrandingV2Modes(branding: BrandingV2): PaletteMode[] {
	return PALETTE_MODES.filter(mode => getModePalette(branding, mode) !== undefined);
}

export interface PaletteModeSelection {
	/** The modes that may be shown. */
	supportedModes: readonly PaletteMode[];
	/** Applies when neither the stored nor the system mode is supported. */
	defaultMode: PaletteMode;
	/** The user's stored choice, if any. */
	storedMode?: PaletteMode | null;
	/** The system's `prefers-color-scheme`; undefined when unknown or when the app ignores it. */
	systemMode?: PaletteMode;
}

/**
 * Selects the mode to show: the stored choice if it is supported, else the system's preference if it is supported,
 * else the default mode. A default mode that is not supported (invalid input) falls back to the first supported mode.
 */
export function selectPaletteMode({supportedModes, defaultMode, storedMode, systemMode}: PaletteModeSelection) {
	if (storedMode && supportedModes.includes(storedMode)) {
		return storedMode;
	}
	if (systemMode && supportedModes.includes(systemMode)) {
		return systemMode;
	}
	if (supportedModes.includes(defaultMode)) {
		return defaultMode;
	}
	return supportedModes[0] ?? defaultMode;
}

const DEFAULT_BORDER_RADIUS = 4; // MUI's own, which the Variocube look uses
const MAX_BORDER_RADIUS = 24;
/** A radius above half the height of a box is clamped by CSS, so this is a pill at any height. */
const FULLY_ROUNDED = 999;

/**
 * Elevation from which a `Paper` is taken to float over the content (MUI: app bar 4, snackbar 6, menu and popover 8,
 * temporary drawer 16, dialog 24). Below it, from 1, a `Paper` is a card in the flow of the page (`Card`, `Paper`,
 * `Accordion` all default to 1).
 */
const FLOATING_ELEVATION = 4;

const OPAQUE_HEX = /^#[0-9a-f]{6}$/i;
const HEX_WITH_OPTIONAL_ALPHA = /^#[0-9a-f]{6}([0-9a-f]{2})?$/i;

/**
 * The theme options of a branding v2 in a mode. It is the Variocube look, except for what the branding sets:
 * - `shape.borderRadius`, and with `buttonBorderRadius` the corner radius of buttons, button groups, toggle buttons and
 *   toggle button groups (0..24 px, anything above is fully rounded; invalid or unset: they follow `shape.borderRadius`);
 * - `palette.primary`, `palette.secondary`, `palette.background.default` (the mode's background) and
 *   `palette.background.paper` (the mode's surface, possibly translucent);
 * - on cards (a `Paper` of the elevation variant with elevation 1..3, including `Card`, also when `raised`): no
 *   shadow without `shadows`, and an outline in `palette.divider` with `outlines` (which also hides the `Accordion`
 *   divider line);
 * - on alerts: like a card, in the severity's colour: a 1 px border in it with `outlines` (not on the `outlined`
 *   variant, which has one), the card shadow (elevation 1) with `shadows`, and `shape.borderRadius`;
 * - without `shadows`, contained buttons, button groups and floating action buttons are flat as well.
 *
 * Floating paper (elevation 4 and more, and the `Autocomplete` list) keeps its shadow and is opaque: the surface
 * composited over the page background, because a menu or dialog without shadow or through which the content shows is
 * unreadable. A `Paper` with elevation 0 or the outlined variant is left as MUI draws it.
 *
 * Invalid input does not break the theme: a colour that is not `#rrggbb` (or `#rrggbbaa` for the surface) falls back
 * to the Variocube colour, the radius is clamped to 0..24, and a mode the branding does not set uses the Variocube
 * colours. A secondary that is absent or `null` in a mode that is set is not invalid: it is the mode's primary.
 */
export function createBrandingV2ThemeOptions(branding: BrandingV2, mode: PaletteMode): ThemeOptions {
	const palette = getModePalette(branding, mode);
	const background = sanitizeHex(palette?.background, OPAQUE_HEX, BACKGROUND[mode]);
	const surface = sanitizeHex(palette?.surface, HEX_WITH_OPTIONAL_ALPHA, PAPER[mode]);
	const floatingSurface = compositeOver(surface, background);
	const primary = sanitizeHex(palette?.primary, OPAQUE_HEX, DEFAULT_PRIMARY);
	// An absent secondary is the tenant's choice of none: it follows the primary. An invalid one is an error.
	// A mode the branding does not set is not a tenant's choice: it keeps the Variocube colours.
	const secondary = palette !== undefined && palette.secondary == null
		? primary
		: sanitizeHex(palette?.secondary, OPAQUE_HEX, DEFAULT_SECONDARY);
	const base = createVariocubeThemeOptions(mode, primary, secondary);
	const surfaces: SurfaceRules = {
		shadows: branding.shadows !== false,
		outlines: branding.outlines === true,
		floatingSurface,
	};
	const buttonRadius = sanitizeButtonBorderRadius(branding.buttonBorderRadius);
	const components: ThemeOptions["components"] = {
		...base.components,
		MuiPaper: {
			styleOverrides: {
				root: ({ownerState, theme}) => paperStyles(ownerState, theme, surfaces),
			},
		},
		MuiCard: {
			styleOverrides: {
				// A raised card is a Paper of elevation 8, which would make it floating: it stays a card.
				root: ({ownerState, theme}) =>
					ownerState.raised
						? {backgroundColor: theme.palette.background.paper, ...cardStyles(theme, surfaces)}
						: {},
			},
		},
		MuiAlert: {
			styleOverrides: {
				root: ({ownerState, theme}) => alertStyles(ownerState, theme, surfaces),
			},
		},
		MuiAutocomplete: {
			styleOverrides: {
				// The list floats, although it is a Paper of elevation 1: look like MUI's own, but opaque. An app
				// that renders it inline with elevation 0, or gives it a floating elevation, gets the Paper rules.
				paper: ({elevation = 1, theme}: { elevation?: number; theme: Pick<Theme, "shadows"> }) =>
					elevation >= 1 && elevation < FLOATING_ELEVATION
						? {backgroundColor: floatingSurface, boxShadow: theme.shadows[elevation], border: "none"}
						: {},
			},
		},
		...(surfaces.shadows ? {} : FLAT_CONTROLS),
		...(surfaces.outlines
			? {
				MuiAccordion: {
					styleOverrides: {
						// Outlined accordions are separated by their border: MUI's divider line would double it.
						root: {"&::before": {display: "none"}},
					},
				},
			}
			: {}),
	};
	return {
		...base,
		shape: {borderRadius: sanitizeBorderRadius(branding.borderRadius)},
		palette: {
			...base.palette,
			background: {default: background, paper: surface},
		},
		components: buttonRadius === undefined ? components : mergeThemeOptions({components}, {
			components: buttonRadiusOverrides(buttonRadius),
		}).components,
	};
}

/**
 * The button radius as style overrides of the root of each button component, so it merges with the app's own overrides
 * of those roots (objects merge; an app's function replaces it, as with any style override). The groups' inner corners
 * stay square: MUI zeroes them with `.MuiButtonGroup-firstButton` and the like, which outrank a button's own rule.
 */
function buttonRadiusOverrides(borderRadius: number): ThemeOptions["components"] {
	const root = {styleOverrides: {root: {borderRadius}}};
	return {MuiButton: root, MuiButtonGroup: root, MuiToggleButton: root, MuiToggleButtonGroup: root};
}

/**
 * The theme of a branding v2 in a mode, with `themeOptions` merged over it (objects merge, arrays and other values
 * replace). It touches no global state, so it can be nested with a plain MUI `ThemeProvider`, e.g. to preview a mode.
 */
export function createBrandingV2Theme(branding: BrandingV2, mode: PaletteMode, themeOptions?: ThemeOptions): Theme {
	const options = createBrandingV2ThemeOptions(branding, mode);
	return createTheme(themeOptions ? mergeThemeOptions(options, themeOptions) : options);
}

/**
 * Without shadows, contained buttons, button groups and floating action buttons are flat too (product decision,
 * variocube/center#518). Defaults rather than style overrides for the buttons, so they merge with an app's own
 * `defaultProps`; `Fab` has no such prop and gets a style override.
 */
const FLAT_CONTROLS: ThemeOptions["components"] = {
	MuiButton: {defaultProps: {disableElevation: true}},
	MuiButtonGroup: {defaultProps: {disableElevation: true}},
	MuiFab: {
		styleOverrides: {
			root: {
				"boxShadow": "none",
				"&:active": {boxShadow: "none"},
				"&.Mui-focusVisible": {boxShadow: "none"},
			},
		},
	},
};

interface SurfaceRules {
	shadows: boolean;
	outlines: boolean;
	floatingSurface: string;
}

function paperStyles(
	ownerState: PaperProps,
	theme: Pick<Theme, "palette">,
	surfaces: SurfaceRules,
): CSSObject {
	// Keeps the base's override: MUI's dark-mode elevation gradient would tint the branding's surface colour.
	const styles: CSSObject = {backgroundImage: "unset"};
	const elevation = ownerState.elevation ?? 1;
	if (ownerState.variant == "outlined" || elevation < 1) {
		return styles;
	}
	if (elevation >= FLOATING_ELEVATION) {
		return {...styles, backgroundColor: surfaces.floatingSurface};
	}
	return {...styles, ...cardStyles(theme, surfaces)};
}

/** The card rules: no shadow without `shadows`, an outline in the divider colour with `outlines`. */
function cardStyles(theme: Pick<Theme, "palette">, {shadows, outlines}: SurfaceRules): CSSObject {
	return {
		...(shadows ? {} : {boxShadow: "none"}),
		...(outlines ? {border: `1px solid ${theme.palette.divider}`} : {}),
	};
}

/**
 * An alert drawn like a card (elevation 1) in its own colour: the severity's colour as the outline, the card shadow,
 * the branding's radius. The `standard` variant keeps its tinted background; the `outlined` one has its border already.
 */
function alertStyles(
	ownerState: Pick<AlertProps, "color" | "severity" | "variant">,
	theme: Pick<Theme, "palette" | "shadows" | "shape">,
	{shadows, outlines}: SurfaceRules,
): CSSObject {
	const severity = ownerState.color ?? ownerState.severity ?? "success";
	return {
		borderRadius: theme.shape.borderRadius,
		...(shadows ? {boxShadow: theme.shadows[1]} : {}),
		...(outlines && ownerState.variant != "outlined" ? {border: `1px solid ${theme.palette[severity].main}`} : {}),
	};
}

function getModePalette(branding: BrandingV2, mode: PaletteMode): BrandingV2Mode | undefined {
	const palette: unknown = branding?.[mode];
	return palette && typeof palette == "object" ? palette as BrandingV2Mode : undefined;
}

function sanitizeHex(color: unknown, pattern: RegExp, fallback: string) {
	return typeof color == "string" && pattern.test(color) ? color : fallback;
}

function sanitizeBorderRadius(radius: unknown) {
	if (typeof radius != "number" || !Number.isFinite(radius)) {
		return DEFAULT_BORDER_RADIUS;
	}
	return Math.min(MAX_BORDER_RADIUS, Math.max(0, Math.round(radius)));
}

/** `undefined` (buttons follow `borderRadius`) unless a finite, non-negative number: 0..24 px, above that fully rounded. */
function sanitizeButtonBorderRadius(radius: unknown): number | undefined {
	if (typeof radius != "number" || !Number.isFinite(radius) || radius < 0) {
		return undefined;
	}
	return radius > MAX_BORDER_RADIUS ? FULLY_ROUNDED : Math.round(radius);
}

/** An opaque `#rrggbb` of a `#rrggbb[aa]` colour laid over an opaque `#rrggbb` one. */
function compositeOver(color: string, under: string) {
	if (color.length == 7) {
		return color;
	}
	const alpha = parseInt(color.slice(7, 9), 16) / 255;
	const channels = [1, 3, 5].map(index => {
		const over = parseInt(color.slice(index, index + 2), 16);
		const below = parseInt(under.slice(index, index + 2), 16);
		return Math.round(alpha * over + (1 - alpha) * below).toString(16).padStart(2, "0");
	});
	return `#${channels.join("")}`;
}
