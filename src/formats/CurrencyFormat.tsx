import {Fragment, useMemo} from "react";
import * as React from "react";
import {useNumberFormat} from "./useNumberFormat";

export type CurrencyDisplay = "symbol" | "name" | "narrowSymbol" | "code";
export type CurrencySign = "accounting" | "standard";

export interface CurrencyFormatProps {
	/**
	 * The numeric amount of currency.
	 */
	value: number | bigint | null | undefined;

	/**
	 * The 3-letter currency identifier.
	 */
	currency: string;

	/**
	 * How to display the currency. Default depends on the browser.
	 */
	currencyDisplay?: CurrencyDisplay;

	/**
	 * The currency sign to use. Default depends on the browser.
	 */
	currencySign?: CurrencySign;

	/**
	 * Minimum fraction digits. Default depends on the browser.
	 */
	minimumFractionDigits?: number;

	/**
	 * Maximum fraction digits. Default depends on the browser.
	 */
	maximumFractionDigits?: number;

	/**
	 * Overrides the user's locale. Use for testing only.
	 */
	locale?: string;
}

/**
 * Returns a string representing the specified `value` in the specified `currency` in the user's locale.
 * @param props
 * @constructor
 */
export function CurrencyFormat(props: CurrencyFormatProps) {
	const {
		value,
		currency,
		currencyDisplay,
		currencySign,
		minimumFractionDigits,
		maximumFractionDigits,
		locale,
	} = props;

	const options = useMemo(() => ({
		style: "currency",
		currency,
		currencyDisplay,
		currencySign,
		minimumFractionDigits,
		maximumFractionDigits,
	}), [currency, currencyDisplay, currencySign, minimumFractionDigits, maximumFractionDigits]);

	const numberFormat = useNumberFormat(options, locale);

	const str = useMemo(() => {
		return (typeof value == "number" || typeof value == "bigint") ? numberFormat.format(value) : "";
	}, [numberFormat, value]);

	return <Fragment>{str}</Fragment>;
}
