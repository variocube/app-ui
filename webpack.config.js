/*
 * Webpack configuration for running the demo.
 */

const path = require("path")
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {

    entry: {
        "main": "./demo/index.tsx"
    },

    output: {
        filename: "[name].[contenthash].js",
        path: __dirname + "/build",
        publicPath: "/"
    },

    mode: "development",

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".css"]
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            {
                test: /\.woff(2?)$/,
                type: "asset/resource"
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },

    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },

    devServer: {
        port: 3000,
        historyApiFallback: {
            index: "/",
            disableDotRule: true
        }
    },

    watchOptions: {
        ignored: [
            path.resolve(__dirname, "node_modules")
        ]
    },

    plugins: [
        new HtmlWebPackPlugin({
            filename: "./index.html",
            title: `VARIOCUBE App UI`,
            template: "./src/splash/template.html",
            meta: {
                viewport: "width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, shrink-to-fit=no",
            }
        }),
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(require("./package.json").version),
        }),
    ]
};
