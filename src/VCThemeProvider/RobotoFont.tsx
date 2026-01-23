import {GlobalStyles} from "@mui/material";
import React, {Fragment} from "react";
import RobotoBoldWoff from "roboto-fontface/fonts/roboto/Roboto-Bold.woff";
import RobotoBoldWoff2 from "roboto-fontface/fonts/roboto/Roboto-Bold.woff2";
import RobotoLightWoff from "roboto-fontface/fonts/roboto/Roboto-Light.woff";
import RobotoLightWoff2 from "roboto-fontface/fonts/roboto/Roboto-Light.woff2";
import RobotoMediumWoff from "roboto-fontface/fonts/roboto/Roboto-Medium.woff";
import RobotoMediumWoff2 from "roboto-fontface/fonts/roboto/Roboto-Medium.woff2";
import RobotoRegularWoff from "roboto-fontface/fonts/roboto/Roboto-Regular.woff";
import RobotoRegularWoff2 from "roboto-fontface/fonts/roboto/Roboto-Regular.woff2";

/**
 * Loads the Roboto fonts used by MUI as specified at:
 * https://mui.com/material-ui/getting-started/installation/#roboto-font
 * @constructor
 */
export const RobotoFont = () => (
	<Fragment>
		<GlobalStyles
			styles={{
				"@font-face": {
					fontFamily: "Roboto",
					src: `url("${RobotoLightWoff2}") format("woff2"), url("${RobotoLightWoff}") format("woff")`,
					fontWeight: 300,
					fontStyle: "normal",
				},
			}}
		/>
		<GlobalStyles
			styles={{
				"@font-face": {
					fontFamily: "Roboto",
					src: `url("${RobotoRegularWoff2}") format("woff2"), url("${RobotoRegularWoff}") format("woff")`,
					fontWeight: 400,
					fontStyle: "normal",
				},
			}}
		/>
		<GlobalStyles
			styles={{
				"@font-face": {
					fontFamily: "Roboto",
					src: `url("${RobotoMediumWoff2}") format("woff2"), url("${RobotoMediumWoff}") format("woff")`,
					fontWeight: 500,
					fontStyle: "normal",
				},
			}}
		/>
		<GlobalStyles
			styles={{
				"@font-face": {
					fontFamily: "Roboto",
					src: `url("${RobotoBoldWoff2}") format("woff2"), url("${RobotoBoldWoff}") format("woff")`,
					fontWeight: 700,
					fontStyle: "normal",
				},
			}}
		/>
	</Fragment>
);
