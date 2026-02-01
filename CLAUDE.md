# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@variocube/app-ui` is a React/TypeScript component library providing common UI components for Variocube applications. It's published as an npm package with Material-UI 5.x as the foundation.

**Key characteristics:**

- React 17.x based component library
- TypeScript with strict mode enabled
- Material-UI (MUI) 5.x peer dependency
- Emotion for CSS-in-JS styling
- Published as ESM module with TypeScript definitions

## Development Commands

```bash
# Development server (Vite dev server on port 3000 with TypeScript type-checking)
npm run dev

# Build the library (TypeScript compilation to esm/)
npm run build

# Run tests (Jest with ts-jest)
npm test

# Build demo site (Vite production build)
npm run build:demo

# Clean build output
npm run clean

# Format code (dprint)
npx dprint fmt
```

## Local Development and Testing

To test changes locally in a consumer project:

1. In this project: `npm pack` (creates a `.tgz` file matching the current version)
2. In consumer project: `npm install ../app-ui/variocube-app-ui-<version>.tgz`

Live demo: https://variocube.github.io/app-ui

## Architecture

### Component Library Structure

The library follows a flat module structure with categorical organization:

- **Core Infrastructure**: `VCThemeProvider`, `AppShell`, `layout`, `storage`
- **Data Display**: `data-table`, `content-table`, `filter`, `tabs`, `list`
- **Forms & Input**: `forms`, `Input/*` (TextField, NumberField, Select, Checkbox, etc.)
- **Interactions**: `confirm/*` (ConfirmButton, ConfirmDialog, ConfirmMenuItem)
- **Utilities**: `fetch`, `localization`, `formats`, `temporal`, `utils`
- **UI Components**: `logo`, `icons`, `country`, `help`, `code`, `ErrorAlert`

All exports are available from the main entry point (`src/index.ts`) for tree-shaking.

### Key Architectural Patterns

#### 1. Context + Hooks Pattern

Global state managed through React Context with custom hooks:

- **VCThemeProvider**: Theme mode (light/dark), custom branding, palette context
  - Hook: `usePaletteMode()`, `useCustomLogo()`
- **LocalizationProvider**: i18n with typed translation objects
  - Hook: `useLocalization()`
- **LayoutProvider**: Page title and app name management
  - Hook: `useLayoutContext()`

#### 2. Factory Pattern

Configuration-based factory functions for creating instances:

- **`createApiFetcher(baseUrl, baseHeaders, baseHeadersModifier?)`**: Returns API client with methods: `fetch`, `fetchJson`, `get`, `post`, `put`, `patch`, `del`
  - Handles error parsing, query strings, file uploads
  - Supports RFC 7807 Problem JSON format
- **`createLocalizationContext(options)`**: Returns `LocalizationProvider`, `StorageLocalizationProvider`, `useLocalization`
  - Deep TypeScript typing for translation objects
  - Mustache template interpolation
  - Storage-backed language persistence

#### 3. Storage Abstraction

Global singleton `storage` wrapper:

- Auto-detects available storage: localStorage → sessionStorage → MemoryStorage
- Event listener pattern for cross-tab synchronization
- React hook: `useStorage<T>(key, defaultValue)`
- Change listeners for reactive updates

#### 4. Wrapper Components

Many Input components wrap MUI components with enhancements:

- `TextField`: Custom validation, lazy validation (after first interaction)
- `Select`, `Checkbox`, `Switch`, `RadioGroup`: Type-safe MUI wrappers
- `Confirm*` components: Wrap Button/IconButton/MenuItem with confirmation dialogs

### Provider Chain and Integration

Typical application structure:

```
VCThemeProvider (theme + branding)
└── AppShell (layout structure)
    └── LayoutProvider (page title management)
        └── StorageLocalizationProvider (i18n with persistence)
            └── Your app components
```

### Theming and Branding

`VCThemeProvider` provides:

- Light/dark mode with system preference detection
- Custom primary/secondary colors (mode-specific)
- Custom logo support (mode-specific URLs)
- Roboto and JetBrains Mono font integration
- Deep MUI theme merging with `deepmerge`

### Type-Safe Localization

The localization system uses recursive TypeScript types for deep object navigation:

- Translation objects with nested structure
- Dot-notation access (e.g., `t("common.actions.save")`)
- Mustache template parameters
- Context-based language switching with storage persistence

### API Communication

`createApiFetcher` factory creates type-safe API clients:

- Base URL and headers configuration
- Request builders: `createJsonRequest(method, body)`
- Query string builder: `createQueryString(...args)`
- Error parsing with Problem JSON support
- File upload with multipart/form-data

## Testing

**Framework:** Jest with ts-jest preset
**Default environment:** Node (some tests override to jsdom via `/** @jest-environment jsdom */` pragma)
**Node version:** 22 (specified in `.nvmrc`)
**Test files:** Located alongside source files with `.spec.ts` extension

```bash
# Run all tests
npm test

# Run specific test
npx jest src/fetch.spec.ts
```

### Node Version Considerations

**Node 22** includes updated ICU (International Components for Unicode) data that affects date/time formatting:

- **German locale (de-AT):** Timezone formatting changed from `"GMT+2"` to `"MESZ"` (localized abbreviation)
- **English locale (en-US):** Timezone formatting remains `"GMT+2"` (unchanged)

If upgrading Node versions and tests fail with timezone mismatches, the expected values likely need updating to match the new ICU data output.

### Known Test Warnings

**MUI v5 + React 17 Compatibility:**
Console warnings about `"Function components cannot be given refs"` from `ForwardRef(InputBase)` are expected and harmless. These come from MUI's internal components and don't affect functionality. The date picker components properly handle refs via `useRenderInput` hook.

## Code Formatting

**Tool:** dprint (v0.46.3)
**Config:** `dprint.json` (symlink to `.devtools/dprint.json` — shared across Variocube projects)

**Configuration:**

- Line width: 120 characters
- Indentation: Tabs (4 spaces width for TypeScript)
- JSON/Markdown: 2-space indentation (no tabs)

```bash
# Format code
npx dprint fmt

# Check formatting
npx dprint check
```

## Pull Request Guidelines

Before submitting a PR, ensure:

**Coder Checklist:**

- Fix IDE warnings/errors where appropriate
- Write unit/integration tests where applicable
- Test issue resolution and that no regressions were introduced
- Test edge cases and error handling
- Verify build and tests succeed
- Resolve conflicts with main branch

**Code Quality:**

- Code is easy to understand and follows best practices
- Components follow existing patterns (wrapper, context+hooks, factory)
- TypeScript types are properly defined
- Error handling is appropriate

## CI/CD Pipeline

GitHub Actions workflow runs on push and PRs (Node 22):

1. `npm ci` - Clean install
2. `npm run build` - TypeScript compilation
3. `npm run test` - Jest tests
4. `npm run build:demo` - Vite demo build
5. NPM publish on tags
6. GitHub Pages deployment on tags

## Dependencies

**Peer Dependencies** (must be provided by consumer):

- `react@17.x`
- `@mui/material@5.x`, `@mui/icons-material@5.x`, `@mui/lab@>5.0.0-alpha`
- `@mui/x-date-pickers@>5.0.0-beta`
- `@emotion/react@11.x`, `@emotion/styled@11.x`
- `mustache@4.x`

**Key Dependencies:**

- `@js-temporal/polyfill` - Temporal API for date/time handling
- `deepmerge` - Theme configuration merging
- `roboto-fontface`, `@fontsource/jetbrains-mono` - Local fonts
- `error-stack-parser` - Error stack analysis
- `react-async-hook` - Async operations

## Build System

The demo application uses **Vite** (v7+) with the following plugins:

- `@vitejs/plugin-react` - React support with Fast Refresh
- `@variocube/vite-plugins` - Splash screen plugin
- `vite-plugin-checker` - TypeScript type-checking during dev and build
- Custom `?source` plugin - Imports files as raw strings for code display in demos

**Key Vite Configuration** (`vite.config.ts`):

- Entry: `index.html` → `demo/index.tsx`
- Output directory: `build/` (for GitHub Pages)
- Dev server port: 3000
- Base path: `""` (empty for flexible deployment)
- VERSION constant injected from package.json

### Custom ?source Plugin Implementation

The demo uses a custom Vite plugin to import source files as raw strings for code display:

```typescript
function sourcePlugin(): Plugin {
	return {
		name: "vite-plugin-source",
		transform(_code, id) {
			const [filepath, query] = id.split("?");
			if (query === "source") {
				const fs = require("fs");
				const rawSource = fs.readFileSync(filepath, "utf-8");
				return {
					code: `export default ${JSON.stringify(rawSource)}`,
					map: null,
				};
			}
		},
	};
}
```

This allows demo files to import their own source code:

```typescript
import source from "./index.tsx?source";
```

## Important: ESM Module Exports

**TypeScript interfaces and types MUST use `export type` in index files:**

Vite uses native ESM, which doesn't export TypeScript interfaces as runtime values. Always separate type and value exports:

```typescript
// ❌ Wrong - causes "does not provide an export" errors
export { FilterTimeFrame, TimeframePicker, TimeFrameType } from "./file";

// ✅ Correct - separate type and value exports
export { TimeframePicker, TimeFrameType } from "./file";
export type { FilterTimeFrame } from "./file";
```

**Affected files in this codebase:**

- `src/date-pickers/index.ts` - `FilterTimeFrame` is a type
- `src/Paging/index.ts` - `Page`, `Pageable`, `PagingSettings`, `Paging` are types (only `PagingImpl` is a value)
- `src/storage/index.ts` - `StorageType` is a type

This issue only occurs with Vite/native ESM, not with webpack's bundler.

## Splash Screen Integration

**For Webpack users:**
Reference splash template in webpack config:

```javascript
new HtmlWebPackPlugin({
	filename: "./index.html",
	template: "./node_modules/@variocube/app-ui/src/splash/template.html",
	title: "My splashy app",
});
```

**For Vite users:**
Use the splash plugin from `@variocube/vite-plugins`:

```typescript
import {splash} from "@variocube/vite-plugins";

export default defineConfig({
	plugins: [splash()],
});
```

Then use the `render` function from `@variocube/app-ui`:

```javascript
import {render} from "@variocube/app-ui";
render(<App />);
```

## Font Loading

For local Google Fonts, add `VCThemeProvider` or `RobotoFont` component to your app. Vite handles font asset loading automatically.

## Troubleshooting

### Dev Server Shows Splash Screen but Nothing Loads

Check browser console for module export errors. Common causes:

1. **TypeScript interfaces exported as values** - Use `export type` instead of `export` for interfaces/types
2. **Missing dependencies** - Run `npm install` to ensure all packages are installed
3. **Port conflicts** - Vite dev server runs on port 3000 by default

### Production Build Output Location

The demo build **must** output to `build/` directory for GitHub Pages deployment. This is configured in `vite.config.ts`:

```typescript
build: {
  outDir: "build",
  emptyOutDir: true,
}
```

Do not change this without updating the GitHub Actions workflow (`.github/workflows/ci.yml`).

### Vite vs Webpack Differences

**Key differences when migrating from webpack:**

- Native ESM requires proper type/value export separation
- HTML template is at project root (`index.html`), not in `src/splash/`
- Environment variables use `import.meta.env` instead of `process.env`
- Asset imports use Vite's native asset handling (no webpack loaders needed)
- Dev server uses different port (3000 vs webpack-dev-server's default 8080)
