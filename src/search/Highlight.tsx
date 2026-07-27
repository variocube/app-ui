import {useTheme} from "@mui/material";
import * as React from "react";
import {Fragment} from "react";
import {splitHighlightParts} from "./highlightParts";

export interface HighlightProps {
	/** The text to render. */
	text: string;

	/** The search input whose whitespace-separated words are emphasized within `text`. */
	highlight?: string;
}

/**
 * Renders `text` with the parts matching any word of `highlight` emphasized in bold.
 *
 * Intended for rendering search results, with the current search input passed as `highlight`.
 */
export function Highlight({text, highlight}: Readonly<HighlightProps>) {
	const theme = useTheme();

	if (!text) {
		return null;
	}

	const parts = splitHighlightParts(text, highlight);
	return (
		<Fragment>
			{parts.map((part, index) =>
				part.highlight
					? (
						<span key={index} style={{fontWeight: theme.typography.fontWeightBold}}>
							{part.text}
						</span>
					)
					// Non-matching text needs no element of its own — the surrounding typography already
					// provides the regular weight.
					: <Fragment key={index}>{part.text}</Fragment>
			)}
		</Fragment>
	);
}
