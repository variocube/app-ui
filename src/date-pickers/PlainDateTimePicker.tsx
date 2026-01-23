import {DateTimePicker, LocalizationProvider, PickersDay} from "@mui/x-date-pickers";
import * as React from "react";
import {PlainDateTime} from "../temporal";
import {PlainDateTimeAdapter} from "./PlainDateTimeAdapter";
import {useLocale} from "./useLocale";
import {useRenderInput, UseRenderInputProps} from "./useRenderInput";

interface PlainDateTimePickerProps {
	value: PlainDateTime | null;
	onChange: (value: PlainDateTime | null) => any;
	label?: string;
	disabled?: boolean;
	required?: boolean;

	disablePast?: boolean;
	minDateTime?: PlainDateTime;
	maxDateTime?: PlainDateTime;
	renderDay?: (day: PlainDateTime, selectedDays: PlainDateTime[]) => JSX.Element;

	/**
	 * Allows overriding the locale. Only use for testing.
	 */
	locale?: string;
}
export function PlainDateTimePicker(props: PlainDateTimePickerProps & UseRenderInputProps) {
	const {
		value,
		onChange,
		label,
		disabled,
		disablePast,
		minDateTime,
		maxDateTime,
		renderDay,
		locale: suppliedLocale,
		...renderInputProps
	} = props;

	const locale = useLocale(suppliedLocale);
	const renderInput = useRenderInput(renderInputProps);

	return (
		<LocalizationProvider dateAdapter={PlainDateTimeAdapter} adapterLocale={locale}>
			<DateTimePicker
				label={label}
				value={value}
				disableMaskedInput
				onChange={onChange}
				disabled={disabled}
				renderInput={renderInput}
				disablePast={disablePast}
				minDateTime={minDateTime}
				maxDateTime={maxDateTime}
				renderDay={renderDay !== undefined
					? (day, selectedDays, pickersDayProps) => (
						<PickersDay {...pickersDayProps}>
							{renderDay(day, selectedDays)}
						</PickersDay>
					)
					: undefined}
			/>
		</LocalizationProvider>
	);
}
