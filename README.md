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
	buttonBorderRadius: null, // px, 0..24, or 999 for pills; null: buttons follow borderRadius
	shadows: false, // cards and tiles cast a shadow
	outlines: true, // cards and tiles have an outline in the mode's divider colour
	defaultMode: "light",
	// `secondary` may be left out or null: it is then the primary colour
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
  `palette.background.paper` (the mode's `surface`, which may be translucent: `#rrggbbaa`). A mode's `secondary` is
  optional: absent or `null`, `palette.secondary` is the mode's primary colour. An invalid one (not `#rrggbb`) is a
  mistake and gets the Variocube colour.
- **Text on surfaces** — every `Paper` root (cards, floating paper), a raised `Card` and the `Autocomplete` list — is
  dark or light, whichever of pure black or white has the higher WCAG contrast ratio with the surface (a translucent
  surface counts as composited over the page background). Its colour is the neutral grey closest to the surface that
  still reaches a contrast ratio of 16:1, a design choice above WCAG AAA (7:1): `#212121` on white, `#1c1c1c` on
  `#fffac8`, `#fbfbfb` on `#1e1e1e`. Where even pure black or white falls short of 16:1 (`#e0e0e0`, `#282b33`), it
  is pure black or white. It is set as `color`, so it is inherited by everything on the surface that sets none. When
  the page background gets text in the same direction as the surface, `palette.text` follows: the grey of the two
  with the higher contrast, so it reaches 16:1 on both where it can (solid primary, MUI's alphas for secondary and
  disabled). When they disagree (a dark page with light tiles), `palette.text` stays as it is, so every colour MUI
  takes from the global palette instead of inheriting keeps the global colour on a surface: `color="text.secondary"`,
  helper texts, placeholders, the primary text of inputs, table cells and chips, and also the `AppShell` bar and
  footer, which set `text.primary` (the bar is in the surface colour without `barBackground`). Only text that sets no
  colour of its own follows the surface. A mode the branding does not set, or whose surface is missing or invalid (for
  the global text also its background), keeps the Variocube text colours.
- **Alerts** are drawn like cards, in their own colour: with `outlines` a `1px` border in the severity's colour (the
  `outlined` variant has one already), with `shadows` the shadow of a card at elevation 1, and the branding's radius.
  The `standard` variant keeps its tinted background, `filled` its solid one.
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
- **Button corner radius** — the optional `buttonBorderRadius` (`number | null`) sets the corners of `Button`,
  `ButtonGroup`, `ToggleButton` and `ToggleButtonGroup` alone; text fields, chips, alerts, cards, dialogs and menus keep
  `borderRadius`, and `Fab` is round already. `0..24` is that many px; above 24 is fully rounded (`999`, a pill at any
  height); unset, `null` or invalid (negative, not a number) follows `borderRadius`. Groups round only their outer
  corners. It is a style override of the `root` of those four components and merges with an app's own object-style
  `styleOverrides.root`; an app that passes a **function** as `styleOverrides.root` for one of them replaces it, so
  that component loses the branding's button radius.
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

## Fonts

`VCThemeProvider` (or the `RobotoFont` component on its own) loads Roboto from `@fontsource-variable/roboto`: the
variable font, so a single file covers every weight, split into subsets by script (Latin, Latin-ext, Greek, Cyrillic,
Vietnamese, math, symbols) with matching `unicode-range`. The browser only downloads the subsets whose characters occur
on the page, which for most pages is the Latin one (43 KB). Text is shown in a fallback font until the file has loaded
(`font-display: swap`). `JetbrainsMonoFont` loads JetBrains Mono (Latin only) for `code`, `kbd`, `pre` and `samp`.

The font files are imported as assets, so the bundler needs to handle `.woff2` imports. Vite does that out of the box;
for webpack, add a loader rule:

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

### Preloading Roboto

The `@font-face` rules are injected when React renders, so the browser discovers the font late. Preloading the Latin
subset in the application's `index.html` lets it start the download right away. With Vite, reference the file in
`node_modules` by a path relative to `index.html`; Vite emits it once and rewrites the link to the same hashed URL
the font face uses:

```html
<link
	rel="preload"
	href="./node_modules/@fontsource-variable/roboto/files/roboto-latin-wght-normal.woff2"
	as="font"
	type="font/woff2"
	crossorigin
>
```

In an npm workspace with hoisted dependencies, the path points at the root `node_modules`, e.g.
`../../node_modules/@fontsource-variable/roboto/files/roboto-latin-wght-normal.woff2` for `apps/<app>/index.html`.
Preload only the Latin subset: a preloaded file that the page does not use costs bandwidth and makes the browser warn.

The link only works in a production build. The Vite dev server serves `index.html` with the `href` as written, while
the font face loads the file from another URL (`/@fs/...`), so in dev the preload is a wasted request: with a hoisted
path it even gets the SPA fallback page. Chrome then logs "preloaded but not used" on every page load, which you can
ignore.

## Temporal

app-ui exports the Temporal API (`Instant`, `ZonedDateTime`, `PlainDateTime`, `PlainDate`, `PlainTime`, `Now`,
`Duration`) plus `DateTimeFormat` and `toTemporalInstant`. Where the browser has a Temporal implementing the current
spec, these are the native objects. Otherwise app-ui loads [`temporal-polyfill`](https://github.com/fullcalendar/temporal-polyfill)
on demand, into a chunk of its own (about 20 KB gzipped), so browsers with native Temporal never download it. A browser
with an outdated or incomplete Temporal gets the polyfill as well.

Use app-ui's exports, not `globalThis.Temporal`. The polyfill is installed on `globalThis` only to provide those
exports; app-ui declares `"sideEffects": false`, so a bundler drops the loader from an app that uses none of them.

### Requirements

- **Top-level `await`:** the loader waits for the polyfill with a top-level `await`, so every module importing app-ui
  waits until Temporal is available and can use it at module load. The bundler must support it: Vite 7 and 8 do with
  their defaults; Vite 6 and older need `build.target: "es2022"` and, for the dev server's dependency pre-bundling,
  `optimizeDeps.esbuildOptions.target: "es2022"`; webpack does from 5.83 on.
- **Tests:** they need a runner loading app-ui as ESM: Vitest, or Jest in ESM mode (`--experimental-vm-modules`). A
  setup that transforms `node_modules` to CommonJS can't load it.

### Migrating from 1.x (`@js-temporal/polyfill` 0.4)

The polyfill app-ui used before implemented an older draft of the spec. APIs removed since then:

| Before                                                          | Now                                                                           |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `Now.timeZone().id`, `Now.zonedDateTimeISO().timeZone`          | `Now.timeZoneId()`                                                            |
| `zonedDateTime.timeZone`                                        | `zonedDateTime.timeZoneId`                                                    |
| `instant.toZonedDateTime(Now.timeZone())`                       | `instant.toZonedDateTimeISO(Now.timeZoneId())`                                |
| `TimeZone` export, time zone and calendar objects               | time zone and calendar IDs (strings)                                          |
| `plainDateTime.toPlainYearMonth()`                              | `plainDateTime.toPlainDate().toPlainYearMonth()`                              |
| `getISOFields()`                                                | the fields themselves (`year`, `month`, …)                                    |
| `epochSeconds`, `epochMicroseconds`                             | `epochMilliseconds`, `epochNanoseconds`                                       |
| `Instant.fromEpochSeconds()`, `Instant.fromEpochMicroseconds()` | `Instant.fromEpochMilliseconds()`, `…Nanoseconds()`                           |
| `Now.zonedDateTime(calendar)`, `Now.plainDate(calendar)`, …     | the `…ISO()` variants, then `withCalendar()`                                  |
| `new DateTimeFormat().format(zonedDateTime)`                    | `TemporalFormat` / `TemporalRangeFormat`, or `zonedDateTime.toLocaleString()` |

`DateTimeFormat` formats an `Instant` and the plain types, not a `ZonedDateTime`, and the `Formattable` type follows
that. `TemporalFormat` and `TemporalRangeFormat` still accept a `ZonedDateTime`: they format it in its own time zone,
with the zone's name unless `dateStyle` or `timeStyle` is set, as before.

`DateTimeFormat`, and so `TemporalFormat` and `TemporalRangeFormat`, throw a `TypeError` for a style or field the
value's type does not have, where 0.4 ignored it and showed the type's default fields: a `dateStyle` or date field
(`year`, `month`, `day`, `weekday`) for a `PlainTime`, a `timeStyle` or time field (`hour`, `minute`, `second`) for a
`PlainDate`. Pass only what the type has, e.g. `dateStyle` for a `PlainDate`, `timeStyle` for a `PlainTime`. A
`PlainDateTime` or `PlainTime` with `timeStyle` `"long"` or `"full"` no longer shows a time zone name: plain types have
none.

## Using for local development

1. In the project run:
   npm pack
2. In Consumer Project run:
   npm install ..\app-ui\variocube-app-ui-1.0.0.tgz
