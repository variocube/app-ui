/**
 * @jest-environment jsdom
 */

import {
	Autocomplete,
	Button,
	Card,
	Fab,
	PaletteMode,
	Paper,
	TextField,
	Theme,
	ThemeProvider,
	useTheme,
} from "@mui/material";
import * as React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import {act as domAct} from "react-dom/test-utils";
import {act, create} from "react-test-renderer";
import {BrandingV2, createBrandingV2Theme} from "./brandingV2";
import {ThemeModeSwitcher} from "./ThemeModeSwitcher";
import {CustomLogo, useCustomLogo, usePaletteMode, VCThemeProvider, VCThemeProviderProps} from "./VCThemeProvider";

// Jest cannot load the font files the font components import.
jest.mock("./JetbrainsMonoFont", () => ({JetbrainsMonoFont: () => null}));
jest.mock("./RobotoFont", () => ({RobotoFont: () => null}));

const MODE_KEY = "variocube-palette-mode";

const BRANDING: BrandingV2 = {
	borderRadius: 8,
	shadows: false,
	outlines: true,
	defaultMode: "light",
	light: {
		primary: "#003366",
		secondary: "#7a2e00",
		background: "#f0f0f0",
		surface: "#ffffffcc",
		logoUrl: "https://example.com/light.svg",
	},
	dark: {primary: "#99ccff", secondary: "#ffb380", background: "#101010", surface: "#202020", logoUrl: null},
	backgroundImage: null,
};

const LIGHT_ONLY: BrandingV2 = {...BRANDING, dark: null};

let systemPrefersDark = false;

beforeAll(() => {
	window.matchMedia = (query: string) => ({
		matches: query == "(prefers-color-scheme: dark)" ? systemPrefersDark : query == "(prefers-color-scheme: light)"
			? !systemPrefersDark
			: false,
		media: query,
		onchange: null,
		addListener: () => void 0,
		removeListener: () => void 0,
		addEventListener: () => void 0,
		removeEventListener: () => void 0,
		dispatchEvent: () => false,
	});
});

beforeEach(() => {
	localStorage.clear();
	systemPrefersDark = false;
});

interface Probed {
	theme: Theme;
	mode: PaletteMode;
	setMode: (mode: PaletteMode) => unknown;
	logo?: CustomLogo;
}

/** Renders the provider and returns what its children see, updated on every render. */
function renderProvider(props: VCThemeProviderProps) {
	const probed = {} as Probed;
	function Probe() {
		const {mode, setMode} = usePaletteMode();
		Object.assign(probed, {theme: useTheme(), mode, setMode, logo: useCustomLogo()});
		return null;
	}
	act(() => {
		create(
			<VCThemeProvider {...props}>
				<Probe />
			</VCThemeProvider>,
		);
	});
	return probed;
}

function storedMode() {
	return JSON.parse(localStorage.getItem(MODE_KEY) ?? "null");
}

test("branding v2 wins over v1, and the logo is the active mode's", () => {
	const probed = renderProvider({branding: {colorPrimary: "#123456", logoDarkUrl: "dark.svg"}, brandingV2: BRANDING});
	expect(probed.theme.palette.primary.main).toBe("#003366");
	expect(probed.logo).toEqual({url: "https://example.com/light.svg"});

	act(() => void probed.setMode("dark"));
	expect(probed.theme.palette.primary.main).toBe("#99ccff");
	expect(probed.logo).toBeUndefined();
});

test("the system preference decides over the default mode, unless the app ignores it", () => {
	systemPrefersDark = true;
	expect(renderProvider({brandingV2: BRANDING}).mode).toBe("dark");
	expect(renderProvider({brandingV2: BRANDING, ignoreSystemMode: true}).mode).toBe("light");
});

test("a branding with one mode always uses it: the stored choice and the system are ignored, setMode is a no-op", () => {
	systemPrefersDark = true;
	localStorage.setItem(MODE_KEY, JSON.stringify("dark"));
	const probed = renderProvider({brandingV2: LIGHT_ONLY});
	expect(probed.mode).toBe("light");

	act(() => void probed.setMode("dark"));
	expect(probed.mode).toBe("light");
	expect(storedMode()).toBe("dark");
});

test("v2 stores no choice equal to the known system mode, but always one without a known system mode", () => {
	systemPrefersDark = true;
	const probed = renderProvider({brandingV2: BRANDING});
	act(() => void probed.setMode("light"));
	expect(storedMode()).toBe("light");
	act(() => void probed.setMode("dark"));
	expect(storedMode()).toBeNull();
	expect(probed.mode).toBe("dark");

	// Without a known system mode, a choice equal to the default mode is kept: it survives another default mode.
	const ignoring = renderProvider({brandingV2: {...BRANDING, defaultMode: "dark"}, ignoreSystemMode: true});
	act(() => void ignoring.setMode("dark"));
	expect(storedMode()).toBe("dark");
	expect(renderProvider({brandingV2: BRANDING, ignoreSystemMode: true}).mode).toBe("dark");
});

test("v1 is unchanged: system mode, stored choice, switcher, colours and the logo of the other mode", () => {
	systemPrefersDark = true;
	const branding = {colorPrimary: "#123456", logoLightUrl: "light.svg", logoPaddingX: 2, logoPaddingY: 1};
	const probed = renderProvider({branding});
	expect(probed.mode).toBe("dark");
	expect(probed.theme.palette.primary.main).toBe("#123456");
	expect(probed.logo).toEqual({url: "light.svg", paddingX: 2, paddingY: 1});

	act(() => void probed.setMode("light"));
	expect(storedMode()).toBe("light");
	act(() => void probed.setMode("dark"));
	expect(storedMode()).toBeNull();

	const switcher = create(
		<VCThemeProvider branding={branding}>
			<ThemeModeSwitcher />
		</VCThemeProvider>,
	).toJSON();
	expect(switcher).not.toBeNull();
});

test("the mode switcher renders nothing for a branding with one mode", () => {
	const switcher = (brandingV2: BrandingV2) =>
		create(
			<VCThemeProvider brandingV2={brandingV2}>
				<ThemeModeSwitcher />
			</VCThemeProvider>,
		).toJSON();
	expect(switcher(LIGHT_ONLY)).toBeNull();
	expect(switcher(BRANDING)).not.toBeNull();
});

test("MUI applies the flat rules to cards (raised too), buttons and FABs, not to floating or inline elevation 0 paper", () => {
	const container = document.createElement("div");
	document.body.appendChild(container);
	domAct(() => {
		render(
			<ThemeProvider theme={createBrandingV2Theme(BRANDING, "light")}>
				<Card data-testid="card" />
				<Card raised data-testid="raised" />
				<Paper elevation={8} data-testid="menu" />
				<Button variant="contained" data-testid="button">Button</Button>
				<Fab data-testid="fab" />
				<div data-testid="dropdown">
					<Autocomplete
						open
						disablePortal
						options={["option"]}
						renderInput={params => <TextField {...params} />}
					/>
				</div>
				<div data-testid="inline">
					<Autocomplete
						open
						disablePortal
						options={["option"]}
						slotProps={{paper: {elevation: 0}}}
						renderInput={params => <TextField {...params} />}
					/>
				</div>
			</ThemeProvider>,
			container,
		);
	});
	const style = (selector: string) => getComputedStyle(container.querySelector(selector) as Element);
	for (const card of ["[data-testid=card]", "[data-testid=raised]"]) {
		expect(style(card).boxShadow).toBe("none");
		expect(style(card).borderStyle).toBe("solid");
		expect(style(card).backgroundColor).toBe("rgba(255, 255, 255, 0.8)"); // the surface, #ffffffcc
	}
	expect(style("[data-testid=menu]").boxShadow).not.toBe("none");
	// Without shadows, buttons and FABs are flat as well; floating paper is not.
	expect(style("[data-testid=button]").boxShadow).toBe("none");
	expect(style("[data-testid=fab]").boxShadow).toBe("none");
	expect(style("[data-testid=menu]").borderStyle).not.toBe("solid");
	// A default Autocomplete list floats: shadow, and the surface made opaque (#ffffffcc over #f0f0f0).
	expect(style("[data-testid=dropdown] .MuiAutocomplete-paper").boxShadow).not.toBe("none");
	expect(style("[data-testid=dropdown] .MuiAutocomplete-paper").backgroundColor).toBe("rgb(252, 252, 252)");
	// One rendered inline with elevation 0 is plain paper.
	expect(style("[data-testid=inline] .MuiAutocomplete-paper").boxShadow).toBe("none");
	expect(style("[data-testid=inline] .MuiAutocomplete-paper").backgroundColor).toBe("rgba(255, 255, 255, 0.8)");
	unmountComponentAtNode(container);
});
