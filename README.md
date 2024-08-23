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
