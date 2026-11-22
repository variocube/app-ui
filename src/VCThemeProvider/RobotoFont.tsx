import RobotoCyrillicExt from "@fontsource-variable/roboto/files/roboto-cyrillic-ext-wght-normal.woff2";
import RobotoCyrillic from "@fontsource-variable/roboto/files/roboto-cyrillic-wght-normal.woff2";
import RobotoGreekExt from "@fontsource-variable/roboto/files/roboto-greek-ext-wght-normal.woff2";
import RobotoGreek from "@fontsource-variable/roboto/files/roboto-greek-wght-normal.woff2";
import RobotoLatinExt from "@fontsource-variable/roboto/files/roboto-latin-ext-wght-normal.woff2";
import RobotoLatin from "@fontsource-variable/roboto/files/roboto-latin-wght-normal.woff2";
import RobotoMath from "@fontsource-variable/roboto/files/roboto-math-wght-normal.woff2";
import RobotoSymbols from "@fontsource-variable/roboto/files/roboto-symbols-wght-normal.woff2";
import RobotoVietnamese from "@fontsource-variable/roboto/files/roboto-vietnamese-wght-normal.woff2";
import unicodeRanges from "@fontsource-variable/roboto/unicode.json";
import {GlobalStyles} from "@mui/material";
import React from "react";

/**
 * The subsets of the Roboto variable font, each with the unicode range it covers.
 *
 * Where ranges overlap, the browser tries the face declared last first. The list therefore runs from the least to the
 * most preferred subset: Latin takes the combining marks it shares with Latin-ext and Vietnamese, and Greek takes the
 * Greek letters the math subset contains too, so a Greek page loads only the Greek subset.
 */
const subsets = [
	{url: RobotoSymbols, unicodeRange: unicodeRanges["symbols"]},
	{url: RobotoMath, unicodeRange: unicodeRanges["math"]},
	{url: RobotoCyrillicExt, unicodeRange: unicodeRanges["cyrillic-ext"]},
	{url: RobotoCyrillic, unicodeRange: unicodeRanges["cyrillic"]},
	{url: RobotoGreekExt, unicodeRange: unicodeRanges["greek-ext"]},
	{url: RobotoGreek, unicodeRange: unicodeRanges["greek"]},
	{url: RobotoVietnamese, unicodeRange: unicodeRanges["vietnamese"]},
	{url: RobotoLatinExt, unicodeRange: unicodeRanges["latin-ext"]},
	{url: RobotoLatin, unicodeRange: unicodeRanges["latin"]},
];

const fontFaces = subsets.map(({url, unicodeRange}) => ({
	"@font-face": {
		fontFamily: "Roboto",
		src: `url("${url}") format("woff2")`,
		fontWeight: "100 900",
		fontStyle: "normal",
		fontDisplay: "swap",
		unicodeRange,
	},
}));

/**
 * Loads the Roboto font used by MUI (https://mui.com/material-ui/getting-started/installation/#roboto-font).
 *
 * It is the variable font, so one file serves every weight, split into subsets by script: the browser downloads only
 * the subsets whose characters occur on the page, which for most pages is the Latin one. Text is shown in a fallback
 * font until the file has loaded (`font-display: swap`). Preloading the Latin subset is up to the application, see
 * the README.
 */
export const RobotoFont = () => <GlobalStyles styles={fontFaces} />;
