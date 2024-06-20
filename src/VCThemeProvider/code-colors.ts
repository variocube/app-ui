import {useTheme} from "@mui/material";
import {green, grey, lightBlue, orange, purple, teal} from "@mui/material/colors";

export const CodeColors = {
	literal: orange,
	number: lightBlue,
	string: green,
	key: purple,
	punctuation: grey,
	className: teal,
} as const;

type TokenType = keyof typeof CodeColors;

export function useThemeShade() {
	const theme = useTheme();
	return theme.palette.mode == "light" ? 700 : 300;
}

export function useCodeColors() {
	const theme = useTheme();
	const shade = useThemeShade();
	const colors = Object.entries(CodeColors)
		.map(([key, value]) => [key as TokenType, value[shade]] as const)
		.reduce((acc, [key, value]) => {
			acc[key] = value;
			return acc;
		}, {} as Record<TokenType, string>);

	return {
		...colors,
		keyword: theme.palette.primary.main,
	};
}
