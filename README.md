# app-ui

Common UI components for Variocube applications.

## Using the splash screen

1. Reference the splash template in your `HtmlWebpackPlugin` options:

```javascript
{
    plugins: [
        new HtmlWebPackPlugin({
            filename: "./index.html",
            template: "./node_modules/@variocube/app-ui/src/splash/template.html",
            title: "My splashy app",
        }),
        // ,..other plugins
    ]
    // ...other config
}
```

1. Use the `render` function of `app-ui` instead of the one from `react-dom`:

```javascript
import * as React from "react";
import {render} from "@variocube/app-ui";
import {App} from "./App";

render(<App/>);
```

## Using local Google Fonts

1. Add `VCThemeProvider` or the `RobotoFont` component to your application. 

2. Configure a loader rule for webfonts in your webpack config:

```javascript
{
    module: {
        rules: [
            {
                test: /\.woff(2?)$/,
                type: "asset/resource"
            },
            // ...other rules
        ]
    }
    // ...other config
}
```