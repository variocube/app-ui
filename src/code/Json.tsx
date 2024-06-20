import {Box} from "@mui/material";
import jsonLexer, {LexerTokens} from "json-lexer";
import React, {Fragment, useMemo} from "react";
import {useCodeColors} from "../VCThemeProvider";

export function Json({data}: { data: any }) {
	const tokens = useMemo(() => {
		const jsonString = JSON.stringify(data, null, 4);
		return detectKeys(jsonLexer(jsonString));
	}, [data]);

	const colors = useCodeColors();

	return (
		<Fragment>
			{tokens.map(({type, value, raw}) => {
				switch (type) {
					case "punctuator":
						return raw;
					case "whitespace":
						return raw;
					case "literal":
						return <Box component="span" color={colors.literal}>{raw}</Box>;
					case "number":
						return <Box component="span" color={colors.number}>{raw}</Box>;
					case "string":
						return <Box component="span" color={colors.string}>{raw}</Box>;
					case "key":
						return <Box component="span" color={colors.key}>{value}</Box>;
				}
			})}
		</Fragment>
	);
}

type NodeType = "array" | "object";

function detectKeys(tokens: LexerTokens) {
	const tree: NodeType[] = [];
	let nextStringIsKey = false;

	return tokens.map(token => {
		if (token.type == "string" && nextStringIsKey) {
			return {
				...token,
				type: "key",
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
