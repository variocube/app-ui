/*
 * Webpack configuration for running the demo.
 */

const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
	entry: {
		"main": "./demo/index.tsx",
	},

	output: {
		filename: "[name].[contenthash].js",
		path: __dirname + "/build",
		publicPath: "",
	},

	mode: "development",

	// Enable sourcemaps for debugging webpack's output.
	devtool: "eval-source-map",

	resolve: {
		// Add '.ts' and '.tsx' as resolvable extensions.
		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".css"],
	},

	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				exclude: /node_modules/,
				resourceQuery: {not: [/source/]},
				loader: "ts-loader",
				options: {
					compilerOptions: {
						declaration: false,
					}
				}
			},
			{
				test: /\.woff(2?)$/,
				type: "asset/resource",
			},
			{
				resourceQuery: /source/,
				type: "asset/source",
			},
		],
	},

	performance: {
		hints: false,
		maxEntrypointSize: 512000,
		maxAssetSize: 512000,
	},

	devServer: {
		port: 3000,
		historyApiFallback: {
			index: "/",
			disableDotRule: true,
		},
	},

	watchOptions: {
		ignored: [
			path.resolve(__dirname, "node_modules"),
		],
	},

	plugins: [
		new HtmlWebPackPlugin({
			filename: "./index.html",
			title: `VARIOCUBE App UI`,
			template: "./src/splash/template.html",
			meta: {
				viewport: "width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, shrink-to-fit=no",
			},
			// manifest: "manifest.json", <-- this would be supported, but it's not used in the demo
		}),
		new webpack.DefinePlugin({
			VERSION: JSON.stringify(require("./package.json").version),
		}),
	],
};
