import JetbrainsMono300Woff from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-300-normal.woff";
import JetbrainsMono300Woff2 from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-300-normal.woff2";
import JetbrainsMono400Woff from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff";
import JetbrainsMono400Woff2 from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2";
import JetbrainsMono500Woff from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff";
import JetbrainsMono500Woff2 from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2";
import JetbrainsMono700Woff from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff";
import JetbrainsMono700Woff2 from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff2";
import {GlobalStyles} from "@mui/material";
import React, {Fragment} from "react";

/**
 * Loads the Jetbrains Mono fonts.
 */
export const JetbrainsMonoFont = () => (
	<Fragment>
		<GlobalStyles
			styles={{
				"@font-face": {
					fontFamily: "Jetbrains Mono",
					src: `url("${JetbrainsMono300Woff2}") format("woff2"), url("${JetbrainsMono300Woff}") format("woff")`,
					fontWeight: 300,
					fontStyle: "normal",
				},
			}}
		/>
		<GlobalStyles
			styles={{
				"@font-face": {
					fontFamily: "Jetbrains Mono",
					src: `url("${JetbrainsMono400Woff2}") format("woff2"), url("${JetbrainsMono400Woff}") format("woff")`,
					fontWeight: 400,
					fontStyle: "normal",
				},
			}}
		/>
		<GlobalStyles
			styles={{
				"@font-face": {
					fontFamily: "Jetbrains Mono",
					src: `url("${JetbrainsMono500Woff2}") format("woff2"), url("${JetbrainsMono500Woff}") format("woff")`,
					fontWeight: 500,
					fontStyle: "normal",
				},
			}}
		/>
		<GlobalStyles
			styles={{
				"@font-face": {
					fontFamily: "Jetbrains Mono",
					src: `url("${JetbrainsMono700Woff2}") format("woff2"), url("${JetbrainsMono700Woff}") format("woff")`,
					fontWeight: 700,
					fontStyle: "normal",
				},
			}}
		/>
		<GlobalStyles
			styles={{
				"code, kbd, pre, samp": {
					fontFamily: "Jetbrains Mono",
				},
			}}
		/>
	</Fragment>
);
