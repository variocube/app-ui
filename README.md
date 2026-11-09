# app-ui

Common UI components for Variocube applications.

## Demos

Check out the demos hosted with GitHub pages: https://variocube.github.io/app-ui

## Using the splash screen

1. Reference the splash template in your `HtmlWebpackPlugin` options:

```javascript
{
	plugins:
	[
		new HtmlWebPackPlugin({
			filename: "./index.html",
			template: "./node_modules/@variocube/app-ui/src/splash/template.html",
			title: "My splashy app",
		}),
		// ,..other plugins
	];
	// ...other config
}
```

1. Use the `render` function of `app-ui` instead of the one from `react-dom`:

```javascript
import {render} from "@variocube/app-ui";
import * as React from "react";
import {App} from "./App";

render(<App />);
```

## Theming with `VCThemeProvider`

`VCThemeProvider` provides the Variocube theme (light and dark mode, fonts, `CssBaseline`) and the context behind
`ThemeModeSwitcher`, `UserNav`'s dark mode switch and `Logo`. It takes one of two branding versions, which Center
serves side by side (variocube/center#518):

| Prop               | What                                                                                                              |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `branding`         | Branding v1 (`Branding`): two colours, a light and a dark logo, raw MUI theme options. Unchanged.                 |
| `brandingV2`       | Branding v2 (`BrandingV2`), see below. **Wins over `branding`** when both are given.                              |
| `ignoreSystemMode` | Skips the system's `prefers-color-scheme` in the mode selection (see below).                                      |
| `themeOptions`     | MUI theme options merged over the built theme, of either version: objects merge, arrays and other values replace. |

### Branding v2

`BrandingV2` mirrors the JSON of Center's `GET /api/app/v2/tenants/{tenantId}/branding/v2` (204 means none: pass
`undefined`, which gives the Variocube look):

```ts
const brandingV2: BrandingV2 = {
	borderRadius: 8, // px, 0..24
	shadows: false, // cards and tiles cast a shadow
	outlines: true, // cards and tiles have an outline in the mode's divider colour
	defaultMode: "light",
	light: {primary: "#00507a", secondary: "#b3261e", background: "#e8eef2", surface: "#ffffffcc", logoUrl: null},
	dark: null, // light only
	backgroundImage: {url: "https://example.com/hall.jpg", anchor: "bottom-left"},
};

<VCThemeProvider brandingV2={brandingV2}>…</VCThemeProvider>;
```

The theme is rebuilt whenever `brandingV2` (or `themeOptions`) is a new object, so keep it stable, e.g. in state or
`useMemo`, rather than building it on every render.

The theme is the Variocube look except for what the branding sets:

- `shape.borderRadius`, clamped to 0..24.
- `palette.primary`, `palette.secondary`, `palette.background.default` (the mode's `background`) and
  `palette.background.paper` (the mode's `surface`, which may be translucent: `#rrggbbaa`).
- **Cards** — a `Paper` of the elevation variant with elevation 1 to 3, which includes `Card` (also `raised`),
  `Paper` and `Accordion` at their defaults — lose their shadow without `shadows` and get a `1px` border in
  `palette.divider` with `outlines`, which also hides the `Accordion` divider line. Use these defaults for branded
  surfaces; `variant="outlined"` and `elevation={0}` stay as MUI draws them.
- **Floating paper** — elevation 4 and more (menus, popovers, dialogs, temporary drawers) and the `Autocomplete`
  list — keeps its shadow and is opaque: the surface composited over the page background, since a menu without an
  edge, or one the content shows through, is unreadable. The rule goes by elevation alone: a `Popover` or `Menu`
  given an elevation below 4 counts as a card, and an `Autocomplete` list rendered inline with elevation 0 is plain
  paper. An `AppBar` (elevation 4) sets its own background unless it has `color="inherit"`, which gets the
  composite.
- **Buttons** — without `shadows`, contained buttons, button groups and floating action buttons are flat as well
  (`disableElevation` as a default prop of `MuiButton` and `MuiButtonGroup`, which merges with an app's own defaults
  such as `size`; a style override for `MuiFab`). Menus, dialogs and popovers keep their shadows.
- MUI's dark-mode elevation gradient is off, as in the Variocube look, so the surface is exactly the branding's
  colour.

A colour that is not `#rrggbb` (`#rrggbbaa` for the surface) falls back to the Variocube colour; a branding without
any mode is ignored. The logo of the active mode is what `Logo` shows (`useCustomLogo()`); a mode without a logo
shows the Variocube logo, not the other mode's. `themeOptions` replaces a style function or object as a whole, so
setting `styleOverrides.root` of `MuiPaper`, `MuiCard` or `MuiFab`, or `styleOverrides.paper` of `MuiAutocomplete`,
there drops the corresponding rules above.

The provider does not draw the background image: the app decides where it goes. Use `background-size: cover` and
`brandingV2BackgroundPosition(anchor)` (`object-fit: cover` and `object-position` for an `<img>`), which maps the
nine anchors (`BRANDING_V2_ANCHORS`) to CSS and a missing one to `DEFAULT_BRANDING_V2_ANCHOR` (`center`):

```tsx
<Box
	sx={{
		backgroundImage: `url(${JSON.stringify(image.url)})`,
		backgroundSize: "cover",
		backgroundPosition: brandingV2BackgroundPosition(image.anchor), // "bottom-left" → "left bottom"
	}}
/>;
```

### Mode selection

1. The user's stored choice (`setMode` of `usePaletteMode()`, stored as `variocube-palette-mode`), if the branding
   supports that mode.
2. Else the system's `prefers-color-scheme`, if the branding supports it and `ignoreSystemMode` is not set.
3. Else branding v2's `defaultMode` (`light` without v2).

A branding with one mode always shows it: `setMode` to a mode it does not support is a no-op, and `ThemeModeSwitcher`
and `UserNav`'s dark mode switch are hidden. `usePaletteMode()` also returns `supportedModes`. A stored choice the
branding does not support is ignored but kept, for a later branding that supports it.

Choosing the mode that applies anyway stores no choice, so the mode keeps following the system:

- With branding v2, only a choice equal to the known system preference is not stored. Without one
  (`ignoreSystemMode`, or a browser without `prefers-color-scheme`) every choice is stored, so it survives a change
  to a branding with another `defaultMode`.
- Without branding v2, a choice equal to the system preference (else `light`) is not stored, as before.

Browsers report `light` when the OS has no preference, so with both modes and the system preference considered,
`defaultMode` only applies in browsers without `prefers-color-scheme`. Devices that should follow `defaultMode` —
the cube, whose Chromium reports `light` without an OS preference — set `ignoreSystemMode`.

`selectPaletteMode` and `getBrandingV2Modes` are the pure functions behind these rules.

### Previewing a branding

`createBrandingV2Theme(branding, mode, themeOptions?)` builds the theme of one mode without touching the stored mode or
any other global state, so a preview nests it with a plain MUI `ThemeProvider` (not `VCThemeProvider`, whose
`CssBaseline` would restyle the whole page). `Logo` reads the enclosing `VCThemeProvider`, so a preview shows
`branding[mode].logoUrl` itself:

```tsx
{
	getBrandingV2Modes(branding).map(mode => (
		<ThemeProvider key={mode} theme={createBrandingV2Theme(branding, mode)}>
			<Box sx={{bgcolor: "background.default", color: "text.primary"}}>
				<Card>…</Card>
			</Box>
		</ThemeProvider>
	));
}
```

`createBrandingV2ThemeOptions(branding, mode)` returns the options instead of the theme. The demo has a page for
branding v2 with an editor and a preview of each mode.

## Using local Google Fonts

1. Add `VCThemeProvider` or the `RobotoFont` component to your application.

2. Configure a loader rule for webfonts in your webpack config:

```javascript
{
	module: {
		rules:
		[
			{
				test: /\.woff(2?)$/,
				type: "asset/resource",
			},
			// ...other rules
		];
	}
	// ...other config
}
```

## Using for local development

1. In the project run:
   npm pack
2. In Consumer Project run:
   npm install ..\app-ui\variocube-app-ui-1.0.0.tgz
