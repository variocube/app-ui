import {Box, Card, CardProps, Divider} from "@mui/material";
import React, {Fragment, PropsWithChildren, useMemo} from "react";
import {PrismLight as SyntaxHighlighter} from "react-syntax-highlighter";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import {CodeBlock, useCodeColors} from "../src";

SyntaxHighlighter.registerLanguage("tsx", tsx);

interface DemoProps extends CardProps {
	id: string;
	source: string;
}

export function Demo({id, source, children, ...cardProps}: PropsWithChildren<DemoProps>) {
	const demoSource = useMemo(() => getDemoSource(source, id), [source, id]);
	const colors = useCodeColors();
	const style = mapStyle(colors);

	return (
		<Card variant="outlined" {...cardProps}>
			{children}
			<CodeBlock px={2} py={2} variant="body2">
				<SyntaxHighlighter
					language="tsx"
					useInlineStyles={true}
					style={style}
					customStyle={{background: "none", margin: 0}}
				>
					{demoSource || "// ERROR: Source could not be determined."}
				</SyntaxHighlighter>
			</CodeBlock>
		</Card>
	);
}

export function DemoSource({children}: PropsWithChildren<{}>) {
	return (
		<Box p={2}>
			{children}
		</Box>
	);
}

export function DemoControls({children}: PropsWithChildren<{}>) {
	return (
		<Fragment>
			<Divider />
			<Box p={2}>
				{children}
			</Box>
		</Fragment>
	);
}

function mapStyle(colors: ReturnType<typeof useCodeColors>) {
	return {
		keyword: {
			color: colors.keyword,
		},
		comment: {
			opacity: 0.7,
			color: colors.punctuation,
		},
		property: {
			color: colors.key,
		},
		punctuation: {
			opacity: 0.7,
			color: colors.punctuation,
		},
		"class-name": {
			color: colors.className,
		},
		string: {
			color: colors.string,
		},
		"attr-value": {
			color: colors.string,
		},
		number: {
			color: colors.number,
		},
	};
}

function getDemoSource(source: string, id: string) {
	const idIndex = source.indexOf(id);
	if (idIndex >= 0) {
		const sourceStartIndex = source.indexOf("<DemoSource>", idIndex);
		if (sourceStartIndex >= 0) {
			const sourceCloseIndex = source.indexOf("</DemoSource>", sourceStartIndex);
			if (sourceCloseIndex >= 0) {
				const lines = splitLines(source.substring(sourceStartIndex + "<DemoSource>".length, sourceCloseIndex));
				// remove empty lines at beginning
				while (!lines[0].trim().length) {
					lines.splice(0, 1);
				}
				// remove empty lines at end
				while (!lines[lines.length - 1].trim().length) {
					lines.splice(lines.length - 1, 1);
				}
				// remove exhaustive indentation
				const match = lines[0].match(/^\s+/);
				if (match) {
					const length = match[0].length;
					return lines.map(line => line.substring(length)).join("\n");
				} else {
					return lines.join("\n");
				}
			}
		}
	}
}

function splitLines(str: string) {
	return str.split(/\r?\n|\r|\n/g);
}
