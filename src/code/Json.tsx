import React, {Fragment, useMemo} from "react";
import jsonLexer, {LexerTokens} from "json-lexer";
import {Box, useTheme} from "@mui/material";
import {green, lightBlue, orange, purple} from "@mui/material/colors";

const COLORS = {
	literal: orange,
	number: lightBlue,
	string: green,
	key: purple,
}

export function Json({data}: {data: any}) {
	const tokens = useMemo(() => {
		const jsonString = JSON.stringify(data, null, 4);
		return detectKeys(jsonLexer(jsonString));
	}, [data]);

	const theme = useTheme();
	const shade = theme.palette.mode == "light" ? 700 : 300;

	return (
		<Fragment>
			{tokens.map(({type, value, raw}) => {
				switch (type) {
					case "punctuator": return raw;
					case "whitespace": return raw;
					case "literal": return <Box component="span" color={COLORS.literal[shade]}>{raw}</Box>;
					case "number": return <Box component="span" color={COLORS.number[shade]}>{raw}</Box>;
					case "string": return <Box component="span" color={COLORS.string[shade]}>{raw}</Box>;
					case "key": return <Box component="span" color={COLORS.key[shade]}>{value}</Box>;
				}
			})}
		</Fragment>
	)
}

type NodeType = "array" | "object";

function detectKeys(tokens: LexerTokens) {
	const tree: NodeType[] = [];
	let nextStringIsKey = false;

	return tokens.map(token => {
		if (token.type == "string" && nextStringIsKey) {
			return {
				...token,
				type: "key"
			};
		}
		if (token.type == "punctuator") {
			switch (token.value) {
				case "{":
					tree.push("object");
					nextStringIsKey = true;
					break;
				case "[":
					tree.push("array");
					break;
				case "}":
				case "]":
					tree.pop();
					nextStringIsKey = tree[tree.length - 1] == "object";
					break;
				case ":":
					nextStringIsKey = false;
					break;
				case ",":
					nextStringIsKey = tree[tree.length - 1] == "object";
					break;
			}
		}
		return token;
	});
}

