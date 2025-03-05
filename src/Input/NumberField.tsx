import {TextField} from "@mui/material";
import {TextFieldProps} from "@mui/material/TextField/TextField";
import * as React from "react";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";

export const IntegerNumberFormat = new Intl.NumberFormat("en-US", {
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
	useGrouping: false,
});

export type NumberFieldProps = TextFieldProps & {
	numberFormat: Intl.NumberFormat;
	numberValue: number | null;
	onChangeNumber: (value: number | null) => void;
	invalidMessage?: string;
};

export function NumberField(
	{
		numberValue,
		onChangeNumber,
		onChange,
		onFocus,
		onBlur,
		onKeyPress,
		numberFormat,
		invalidMessage,
		helperText,
		...props
	}: NumberFieldProps,
) {
	const [strValue, setStrValue] = useState("");
	const [error, setError] = useState("");
	const [focus, setFocus] = useState(false);
	const input = useRef<HTMLInputElement | null>(null);

	// find out decimal separator
	const decimalSeparator = useMemo(() => {
		return numberFormat.format(1.1).replace(/[01]/g, "");
	}, [numberFormat]);

	// find out thousands separator
	const thousandSeparator = useMemo(() => {
		return numberFormat.format(1111).replace(/[01]/g, "").replace(decimalSeparator, "");
	}, [numberFormat, decimalSeparator]);

	// restrict key press to chars that can be part of a number
	const handleKeyPress = useCallback((e) => {
		const keyValue = String.fromCharCode(e.charCode);
		if (!keyValue.match(/[\-0-9]/g) && keyValue !== thousandSeparator && keyValue !== decimalSeparator) {
			e.preventDefault();
		} else {
			onKeyPress && onKeyPress(e);
		}
	}, [onKeyPress, thousandSeparator, decimalSeparator]);

	// set controlled string value and call onChange with numeric value
	const handleChange = useCallback((e) => {
		const {value} = e.currentTarget;
		setStrValue(value);
		onChangeNumber(value ? parseNumber(value, thousandSeparator, decimalSeparator) : null);
		onChange && onChange(e);
	}, [thousandSeparator, decimalSeparator, onChangeNumber, onChange]);

	// remember focus
	const handleFocus = useCallback(e => {
		setFocus(true);
		onFocus && onFocus(e);
	}, [onFocus]);

	// format on blur
	const handleBlur = useCallback((e) => {
		setFocus(false);
		onBlur && onBlur(e);
	}, [onBlur, numberFormat, numberValue]);

	// format when number value changes and user is not editing
	useEffect(() => {
		if (!focus) {
			if (numberValue !== null && Number.isFinite(numberValue)) {
				setStrValue(numberFormat.format(numberValue));
			}
		}
	}, [focus, numberValue]);

	// set error message when user entered a string that is NaN
	useEffect(() => {
		const valid = (numberValue === null || Number.isFinite(numberValue));
		setError(valid ? "" : (invalidMessage || "Invalid number"));
	}, [numberValue, invalidMessage]);

	// apply error to HTML5 form validation
	useEffect(() => {
		if (input.current) {
			input.current.setCustomValidity(error);
		}
	}, [error]);

	return (
		<TextField
			{...props}
			value={strValue}
			inputRef={input}
			error={!!error}
			helperText={error || helperText}
			onFocus={handleFocus}
			onBlur={handleBlur}
			onKeyPress={handleKeyPress}
			onChange={handleChange}
		/>
	);
}

function parseNumber(value: string, thousandSeparator: string, decimalSeparator: string) {
	if (thousandSeparator) {
		value = replaceAll(value, thousandSeparator, "");
	}
	if (decimalSeparator) {
		value = replaceAll(value, decimalSeparator, ".");
	}
	return Number.parseFloat(value);
}

function replaceAll(str: string, search: string, replacement: string) {
	return str.split(search).join(replacement);
}
