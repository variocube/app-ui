import {Fragment, useMemo} from "react";
import * as React from "react";
import {useNumberFormat} from "./useNumberFormat";

export interface DecimalFormatProps {
	/**
	 * The numeric amount of currency.
	 */
	value: number | bigint | null | undefined;

	/**
	 * Minimum fraction digits. Default depends on the browser.
	 */
	minimumFractionDigits?: number;

	/**
	 * Maximum fraction digits. Default depends on the browser.
	 */
	maximumFractionDigits?: number;

	/**
	 * Fraction digits. Shorthand to set both `minimumFractionDigits` and `maximumFractionDigits`.
	 */
	fractionDigits?: number;

	/**
	 * Overrides the user's locale. Use for testing only.
	 */
	locale?: string;
}

/**
 * Returns a string representing the specified `value` formatted according to the user's locale.
 * @param props
 * @constructor
 */
export function DecimalFormat(props: DecimalFormatProps) {
	const {
		value,
		fractionDigits,
		minimumFractionDigits = fractionDigits,
		maximumFractionDigits = fractionDigits,
		locale,
	} = props;

	const options = useMemo(() => ({
		style: "decimal",
		minimumFractionDigits,
		maximumFractionDigits,
	}), [minimumFractionDigits, maximumFractionDigits]);

	const numberFormat = useNumberFormat(options, locale);

	const str = useMemo(() => {
		return (typeof value == "number" || typeof value == "bigint") ? numberFormat.format(value) : "";
	}, [numberFormat, value]);

	return <Fragment>{str}</Fragment>;
}
