import {Fragment, useMemo} from "react";
import * as React from "react";
import {useNumberFormat} from "./useNumberFormat";

export type CompactDisplay = "long" | "short";

export interface CompactFormatProps {
	/**
	 * The numeric amount of currency.
	 */
	value: number | bigint | null | undefined;

	/**
	 * Compact display.
	 */
	compactDisplay?: CompactDisplay;

	/**
	 * Overrides the user's locale. Use for testing only.
	 */
	locale?: string;
}

/**
 * Returns a compact string representing the large number `value` formatted according to the user's locale.
 * @param props
 * @constructor
 */
export function CompactFormat(props: CompactFormatProps) {
	const {
		value,
		compactDisplay,
		locale,
	} = props;

	const options = useMemo(() => ({
		notation: "compact",
		compactDisplay,
	} as const), [compactDisplay]);

	const numberFormat = useNumberFormat(options, locale);

	const str = useMemo(() => {
		return (typeof value == "number" || typeof value == "bigint") ? numberFormat.format(value) : "";
	}, [numberFormat, value]);

	return <Fragment>{str}</Fragment>;
}
