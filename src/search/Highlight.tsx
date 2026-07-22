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
	if (!text) {
		return null;
	}

	const parts = splitHighlightParts(text, highlight);
	return (
		<Fragment>
			{parts.map((part, index) => (
				<span
					key={index}
					style={{
						fontWeight: part.highlight ? 700 : 400,
					}}
				>
					{part.text}
				</span>
			))}
		</Fragment>
	);
}
