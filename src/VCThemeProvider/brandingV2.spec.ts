import {CSSObject, PaletteMode, Theme} from "@mui/material";
import {describe, expect, test} from "vitest";
import {
	BRANDING_V2_ANCHORS,
	BrandingV2,
	brandingV2BackgroundPosition,
	createBrandingV2Theme,
	createBrandingV2ThemeOptions,
	getBrandingV2Modes,
	selectPaletteMode,
} from "./brandingV2";

const LIGHT = {
	primary: "#003366",
	secondary: "#7a2e00",
	background: "#f0f0f0",
	surface: "#ffffffcc",
	logoUrl: "https://example.com/light.svg",
};

const DARK = {
	primary: "#99ccff",
	secondary: "#ffb380",
	background: "#101010",
	surface: "#202020",
	logoUrl: null,
};

function branding(overrides: Partial<BrandingV2> = {}): BrandingV2 {
	return {
		borderRadius: 8,
		shadows: true,
		outlines: false,
		defaultMode: "light",
		light: LIGHT,
		dark: DARK,
		backgroundImage: null,
		...overrides,
	};
}

/** The styles the theme's Paper override gives a Paper with these props. */
function paperStyles(theme: Theme, ownerState: { variant?: "elevation" | "outlined"; elevation?: number }): CSSObject {
	const root = theme.components?.MuiPaper?.styleOverrides?.root as (props: unknown) => CSSObject;
	return root({ownerState: {variant: "elevation", elevation: 1, ...ownerState}, theme});
}

describe("the branding v2 theme", () => {
	test("the radius is the branding's, clamped to 0..24, and MUI's 4 when it is not a number", () => {
		expect(createBrandingV2Theme(branding({borderRadius: 12}), "light").shape.borderRadius).toBe(12);
		expect(createBrandingV2Theme(branding({borderRadius: -3}), "light").shape.borderRadius).toBe(0);
		expect(createBrandingV2Theme(branding({borderRadius: 99}), "light").shape.borderRadius).toBe(24);
		expect(createBrandingV2Theme(branding({borderRadius: NaN}), "light").shape.borderRadius).toBe(4);
	});

	test.each<[PaletteMode, typeof LIGHT | typeof DARK]>([["light", LIGHT], ["dark", DARK]])(
		"the %s palette is the mode's colours: accents, page background and surface",
		(mode, colours) => {
			const {palette} = createBrandingV2Theme(branding(), mode);
			expect(palette.mode).toBe(mode);
			expect(palette.primary.main).toBe(colours.primary);
			expect(palette.secondary.main).toBe(colours.secondary);
			expect(palette.background).toEqual({default: colours.background, paper: colours.surface});
		},
	);

	test("a secondary that is absent or null is the mode's primary, an invalid one the Variocube colour", () => {
		const secondaryOf = (secondary?: string | null) =>
			createBrandingV2Theme(branding({light: {...LIGHT, secondary}}), "light").palette.secondary.main;
		expect(secondaryOf(undefined)).toBe(LIGHT.primary);
		expect(secondaryOf(null)).toBe(LIGHT.primary);
		expect(secondaryOf("red")).toBe("#009dd8");
	});

	describe("alerts", () => {
		function alertStyles(theme: Theme, ownerState: { severity?: "error" | "info"; variant?: string }): CSSObject {
			const root = theme.components?.MuiAlert?.styleOverrides?.root as (props: unknown) => CSSObject;
			return root({ownerState: {severity: "error", variant: "standard", ...ownerState}, theme});
		}

		test("with outlines an alert has a 1 px border in its severity's colour, not on the outlined variant", () => {
			const theme = createBrandingV2Theme(branding({outlines: true}), "light");
			expect(alertStyles(theme, {severity: "error"}).border).toBe(`1px solid ${theme.palette.error.main}`);
			expect(alertStyles(theme, {severity: "info"}).border).toBe(`1px solid ${theme.palette.info.main}`);
			expect(alertStyles(theme, {variant: "outlined"})).not.toHaveProperty("border");
			const without = createBrandingV2Theme(branding({outlines: false}), "light");
			expect(alertStyles(without, {})).not.toHaveProperty("border");
		});

		test("with shadows an alert has the card shadow, without it none; the radius is the branding's", () => {
			const shadowed = createBrandingV2Theme(branding({shadows: true}), "light");
			expect(alertStyles(shadowed, {})).toMatchObject({boxShadow: shadowed.shadows[1], borderRadius: 8});
			expect(alertStyles(createBrandingV2Theme(branding({shadows: false}), "light"), {})).not.toHaveProperty(
				"boxShadow",
			);
		});
	});

	test("everything the branding does not set is the Variocube look of the mode", () => {
		const options = createBrandingV2ThemeOptions(branding(), "dark");
		expect(options.typography).toEqual(expect.objectContaining({h1: {fontSize: 46, fontWeight: 300}}));
		expect(options.palette?.success).toEqual({main: "#58cc5c"});
		// The text colours follow a mode's surface: only a mode the branding does not set keeps the Variocube ones.
		expect(createBrandingV2ThemeOptions(branding({dark: null}), "dark").palette?.text).toEqual({
			primary: "#fdfaf7",
		});
	});

	test("a mode the branding does not set keeps the Variocube secondary, not its primary", () => {
		const {palette} = createBrandingV2Theme(branding({dark: null}), "dark");
		expect(palette.primary.main).toBe("#ff6a00");
		expect(palette.secondary.main).toBe("#009dd8");
	});

	test("a translucent #rrggbbaa surface is kept as it is", () => {
		const theme = createBrandingV2Theme(branding({light: {...LIGHT, surface: "#FFFFFF80"}}), "light");
		expect(theme.palette.background.paper).toBe("#FFFFFF80");
	});

	test("a colour that is not #rrggbb (#rrggbbaa for the surface) falls back to the Variocube colour", () => {
		const invalid = {primary: "red", secondary: "#abc", background: "#00000080", surface: "#12345", logoUrl: null};
		const {palette} = createBrandingV2Theme(branding({light: invalid}), "light");
		expect(palette.primary.main).toBe("#ff6a00");
		expect(palette.secondary.main).toBe("#009dd8");
		expect(palette.background).toEqual({default: "#fffaf7", paper: "#ffffff"});
	});

	test("without shadows a card is flat, with shadows it keeps MUI's", () => {
		expect(paperStyles(createBrandingV2Theme(branding({shadows: false}), "light"), {})).toMatchObject({
			boxShadow: "none",
		});
		expect(paperStyles(createBrandingV2Theme(branding({shadows: true}), "light"), {})).not.toHaveProperty(
			"boxShadow",
		);
	});

	test("without shadows contained buttons and FABs are flat too, merged with the app's button defaults", () => {
		const flat = createBrandingV2Theme(branding({shadows: false}), "light", {
			components: {MuiButton: {defaultProps: {size: "large"}}},
		});
		expect(flat.components?.MuiButton?.defaultProps).toEqual({disableElevation: true, size: "large"});
		expect(flat.components?.MuiButtonGroup?.defaultProps).toEqual({disableElevation: true});
		expect(flat.components?.MuiFab?.styleOverrides?.root).toMatchObject({boxShadow: "none"});

		const raised = createBrandingV2Theme(branding({shadows: true}), "light");
		expect(raised.components?.MuiButton).toBeUndefined();
		expect(raised.components?.MuiFab).toBeUndefined();
	});

	describe("the button radius", () => {
		const BUTTONS = ["MuiButton", "MuiButtonGroup", "MuiToggleButton", "MuiToggleButtonGroup"] as const;
		const rootOf = (theme: Theme, name: typeof BUTTONS[number]) => theme.components?.[name]?.styleOverrides?.root;

		test("unset, null or invalid: buttons follow the radius, no override", () => {
			for (const buttonBorderRadius of [undefined, null, -1, NaN, Infinity, "8" as never]) {
				const theme = createBrandingV2Theme(branding({buttonBorderRadius}), "light");
				BUTTONS.forEach(name => expect(theme.components?.[name]).toBeUndefined());
			}
		});

		test.each([[0, 0], [16, 16], [24, 24], [25, 999], [999, 999]])(
			"%d is %d px on buttons, button groups, toggle buttons and toggle button groups only",
			(buttonBorderRadius, expected) => {
				const theme = createBrandingV2Theme(branding({borderRadius: 4, buttonBorderRadius}), "light");
				BUTTONS.forEach(name => expect(rootOf(theme, name)).toEqual({borderRadius: expected}));
				expect(theme.shape.borderRadius).toBe(4);
				expect(theme.components?.MuiAutocomplete).toBeDefined();
				expect(theme.components?.MuiChip).toBeUndefined();
			},
		);

		test("merges with the app's button style overrides and the flat defaults", () => {
			const theme = createBrandingV2Theme(branding({shadows: false, buttonBorderRadius: 12}), "light", {
				components: {MuiButton: {styleOverrides: {root: {textTransform: "none"}}}},
			});
			expect(rootOf(theme, "MuiButton")).toEqual({borderRadius: 12, textTransform: "none"});
			expect(theme.components?.MuiButton?.defaultProps).toEqual({disableElevation: true});
		});
	});

	test("with outlines a card has a border in the divider colour, independent of the shadows", () => {
		const outlined = createBrandingV2Theme(branding({outlines: true, shadows: true}), "dark");
		expect(paperStyles(outlined, {elevation: 2})).toEqual({
			backgroundImage: "unset",
			color: "#fdfdfd",
			border: `1px solid ${outlined.palette.divider}`,
		});
		expect(paperStyles(createBrandingV2Theme(branding({outlines: false}), "dark"), {})).not.toHaveProperty(
			"border",
		);
		// The border separates stacked accordions: MUI's divider line above each would double it.
		expect(outlined.components?.MuiAccordion?.styleOverrides?.root).toEqual({"&::before": {display: "none"}});
		expect(createBrandingV2Theme(branding({outlines: false}), "dark").components?.MuiAccordion).toBeUndefined();
	});

	test("floating paper keeps its shadow and is the surface made opaque over the page background", () => {
		const theme = createBrandingV2Theme(
			branding({shadows: false, outlines: true, light: {...LIGHT, background: "#000000", surface: "#ffffff80"}}),
			"light",
		);
		expect(paperStyles(theme, {elevation: 8})).toEqual({
			backgroundImage: "unset",
			color: "#000000",
			backgroundColor: "#808080",
		});
	});

	describe("text on surfaces", () => {
		const themeWith = (mode: PaletteMode, colours: { background: string; surface: string }) =>
			createBrandingV2Theme(branding({[mode]: {...LIGHT, ...colours}}), mode);

		test.each([
			// The grey closest to the surface that reaches 16:1.
			["#ffffff", "#212121"],
			["#fffac8", "#1c1c1c"],
			["#fff02d", "#101010"],
			["#1e1e1e", "#fbfbfb"],
			// Even pure black or white falls short of 16:1.
			["#e0e0e0", "#000000"],
			["#282b33", "#ffffff"],
			// Next to the point where black and white have the same contrast: the direction is the higher one.
			["#808080", "#000000"],
			["#707070", "#ffffff"],
		])("the text on surface %s is %s", (surface, expected) => {
			const theme = themeWith("light", {background: "#ffffff", surface});
			for (const elevation of [0, 1, 8]) {
				expect(paperStyles(theme, {elevation}).color).toBe(expected);
			}
			expect(paperStyles(theme, {variant: "outlined"}).color).toBe(expected);
		});

		test("a translucent surface counts as composited over the background", () => {
			// The raw colours of these surfaces say the opposite: 25% black over white is #bfbfbf (dark text), 25%
			// white over black is #404040 (light text).
			expect(paperStyles(themeWith("light", {background: "#ffffff", surface: "#00000040"}), {}).color)
				.toBe("#000000");
			expect(paperStyles(themeWith("light", {background: "#000000", surface: "#ffffff40"}), {}).color)
				.toBe("#ffffff");
		});

		test("a mode with empty or invalid colours keeps the Variocube text colours", () => {
			const empty = {primary: "", secondary: "", background: "", surface: "", logoUrl: null};
			const theme = createBrandingV2Theme(branding({light: empty}), "light");
			expect(paperStyles(theme, {})).not.toHaveProperty("color");
			expect(theme.palette.text.primary).toBe("#282b33");
			// A valid surface with an invalid background has no global text of its own to derive.
			const noBackground = createBrandingV2Theme(
				branding({light: {...empty, surface: "#fff02d"}}),
				"light",
			);
			expect(paperStyles(noBackground, {}).color).toBe("#101010");
			expect(noBackground.palette.text.primary).toBe("#282b33");
			// A valid background with an invalid surface has no surface text, so the global text does not follow either.
			const noSurface = createBrandingV2Theme(branding({light: {...empty, background: "#ffffff"}}), "light");
			expect(paperStyles(noSurface, {})).not.toHaveProperty("color");
			expect(noSurface.palette.text.primary).toBe("#282b33");
		});

		test("a raised card and the Autocomplete list get the surface's text colour too", () => {
			const theme = themeWith("light", {background: "#ffffff", surface: "#1e1e1e"});
			const card = theme.components?.MuiCard?.styleOverrides?.root as (props: unknown) => CSSObject;
			expect(card({ownerState: {raised: true}, theme})).toMatchObject({color: "#fbfbfb"});
			expect(card({ownerState: {raised: false}, theme})).toEqual({});
			const list = theme.components?.MuiAutocomplete?.styleOverrides?.paper as (props: unknown) => CSSObject;
			expect(list({elevation: 1, theme})).toMatchObject({color: "#fbfbfb"});
		});

		test("background and surface in the same direction give the global text the higher contrast of the two", () => {
			// Dark text: the darker grey, here the surface's (#1c1c1c, the background's is #212121) ...
			const light = themeWith("light", {background: "#ffffff", surface: "#fffac8"}).palette.text;
			expect([light.primary, light.secondary, light.disabled]).toEqual([
				"#1c1c1c",
				"rgba(28, 28, 28, 0.6)",
				"rgba(28, 28, 28, 0.38)",
			]);
			// ... here the background's (#101010, the surface's is #212121).
			expect(themeWith("light", {background: "#fff02d", surface: "#ffffff"}).palette.text.primary).toBe(
				"#101010",
			);
			// Light text: the lighter grey, the surface's #fbfbfb (the background's is #ededed), with the dark alphas.
			const dark = themeWith("dark", {background: "#121212", surface: "#1e1e1e"}).palette.text;
			expect([dark.primary, dark.secondary, dark.disabled, (dark as { icon?: string }).icon]).toEqual([
				"#fbfbfb",
				"rgba(251, 251, 251, 0.7)",
				"rgba(251, 251, 251, 0.5)",
				"rgba(251, 251, 251, 0.5)",
			]);
		});

		test("background and surface in different directions leave the global text as in the Variocube look", () => {
			const theme = themeWith("light", {background: "#101010", surface: "#fff02d"});
			expect(theme.palette.text.primary).toBe("#282b33");
			expect(
				createBrandingV2ThemeOptions(
					branding({light: {...LIGHT, background: "#101010", surface: "#fff02d"}}),
					"light",
				)
					.palette?.text,
			).toEqual({primary: "#282b33"});
			expect(paperStyles(theme, {}).color).toBe("#101010");
		});

		test("a mode the branding does not set keeps the Variocube text colours", () => {
			const theme = createBrandingV2Theme(branding({dark: null}), "dark");
			expect(paperStyles(theme, {})).not.toHaveProperty("color");
			expect(theme.palette.text.primary).toBe("#fdfaf7");
		});
	});

	test("paper is never tinted by MUI's dark-mode elevation gradient", () => {
		const theme = createBrandingV2Theme(branding(), "dark");
		for (const elevation of [0, 1, 8]) {
			expect(paperStyles(theme, {elevation}).backgroundImage).toBe("unset");
		}
	});
});

describe("the supported modes", () => {
	test("are the modes the branding sets, light before dark", () => {
		expect(getBrandingV2Modes(branding())).toEqual(["light", "dark"]);
		expect(getBrandingV2Modes(branding({light: null}))).toEqual(["dark"]);
		expect(getBrandingV2Modes(branding({light: null, dark: null}))).toEqual([]);
	});
});

describe("the mode selection", () => {
	const both: PaletteMode[] = ["light", "dark"];

	test("the stored choice wins when it is supported", () => {
		expect(selectPaletteMode({supportedModes: both, defaultMode: "light", storedMode: "dark", systemMode: "light"}))
			.toBe("dark");
	});

	test("a stored choice that is not supported is ignored for the system's preference", () => {
		expect(selectPaletteMode({supportedModes: ["light"], defaultMode: "light", storedMode: "dark"})).toBe("light");
		expect(selectPaletteMode({supportedModes: both, defaultMode: "light", storedMode: null, systemMode: "dark"}))
			.toBe("dark");
	});

	test("the default mode applies without a supported system preference", () => {
		expect(selectPaletteMode({supportedModes: both, defaultMode: "dark"})).toBe("dark");
		expect(selectPaletteMode({supportedModes: ["dark"], defaultMode: "dark", systemMode: "light"})).toBe("dark");
	});

	test("a default mode that is not supported falls back to the supported one", () => {
		expect(selectPaletteMode({supportedModes: ["dark"], defaultMode: "light"})).toBe("dark");
	});
});

describe("the background position", () => {
	test("maps each anchor as the contract does, and a missing or unknown one to the centre", () => {
		expect(BRANDING_V2_ANCHORS.map(brandingV2BackgroundPosition)).toEqual([
			"left top",
			"center top",
			"right top",
			"left center",
			"center center",
			"right center",
			"left bottom",
			"center bottom",
			"right bottom",
		]);
		expect(brandingV2BackgroundPosition(null)).toBe("center center");
		expect(brandingV2BackgroundPosition("middle" as never)).toBe("center center");
	});
});
