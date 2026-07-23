import {Box, FormControl, FormHelperText, Input, InputLabel, MenuItem, OutlinedInput, Select} from "@mui/material";
import {InputBaseComponentProps} from "@mui/material/InputBase";
import {unstable_useId as useId} from "@mui/material/utils";
import * as React from "react";
import {
	createContext,
	forwardRef,
	MutableRefObject,
	ReactNode,
	useContext,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from "react";
import {getSupportedFormatLocale} from "../getSupportedFormatLocale";
import {Duration} from "../temporal";
import {
	buildRows,
	changeRowUnit,
	DEFAULT_DURATION_FIELD_UNITS,
	DurationFieldRow,
	DurationFieldUnit,
	durationFromRows,
	getUnitOptions,
	normalizeRows,
	parseAmount,
	sortUnits,
} from "./DurationFieldModel";

export type { DurationFieldUnit };
export { DEFAULT_DURATION_FIELD_UNITS, DURATION_FIELD_UNITS } from "./DurationFieldModel";

export interface DurationFieldProps {
	/**
	 * The duration value. `null` means unset.
	 */
	value: Duration | null | undefined;

	/**
	 * Called with the new duration, or `null` when no amount is entered.
	 * The entered units are kept as-is, they are never converted or balanced
	 * (365 days stays 365 days and does not become 1 year).
	 */
	onChange?: (value: Duration | null) => void;

	/**
	 * The units offered to the user, e.g. `["years", "months", "days"]` for a
	 * date-based period. Defaults to all units except `weeks`.
	 */
	units?: ReadonlyArray<DurationFieldUnit>;

	label?: ReactNode;
	helperText?: ReactNode;
	error?: boolean;
	required?: boolean;
	disabled?: boolean;
	fullWidth?: boolean;
	size?: "small" | "medium";

	/**
	 * Overrides the user's locale. Use for testing only.
	 */
	locale?: string;
}

interface DurationFieldContextValue {
	rows: DurationFieldRow[];
	units: ReadonlyArray<DurationFieldUnit>;
	locale: string;
	labelId: string | undefined;
	disabled: boolean;
	firstInputRef: MutableRefObject<HTMLInputElement | null>;
	onAmountChange: (index: number, text: string) => void;
	onUnitChange: (index: number, unit: DurationFieldUnit) => void;
}

const DurationFieldContext = createContext<DurationFieldContextValue | null>(null);

/**
 * An input control for a `Temporal.Duration` (e.g. a retention period that maps to a
 * `java.time.Period` on the backend). The user edits the duration as a sequence of
 * number+unit pairs; after the last entered pair, an empty pair with the next smaller
 * unit allows adding another component.
 */
export function DurationField(props: DurationFieldProps) {
	const {
		value,
		onChange,
		units: unitsProp,
		label,
		helperText,
		error,
		required,
		disabled,
		fullWidth,
		size,
		locale: localeProp,
	} = props;

	const units = useMemo(() => sortUnits(unitsProp ?? DEFAULT_DURATION_FIELD_UNITS), [unitsProp]);
	const locale = useMemo(() => localeProp ?? getSupportedFormatLocale("number"), [localeProp]);
	const labelId = useId();

	const [rows, setRows] = useState(() => buildRows(value, units));
	const firstInputRef = useRef<HTMLInputElement | null>(null);

	const valueIso = value?.toString() ?? "";
	useEffect(() => {
		// Rebuild rows only when the value/units change externally, not on local edits.
		// `rows` and `value` are read intentionally without subscribing to them.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		if ((durationFromRows(rows)?.toString() ?? "") !== valueIso) {
			setRows(buildRows(value, units));
		}
	}, [valueIso, units]);

	function emit(nextRows: DurationFieldRow[]) {
		setRows(nextRows);
		if (onChange) {
			const duration = durationFromRows(nextRows);
			if ((duration?.toString() ?? "") !== valueIso) {
				onChange(duration);
			}
		}
	}

	function handleAmountChange(index: number, text: string) {
		const sanitized = text.replace(/[^0-9]/g, "");
		const edited = rows.map((row, i) => i === index ? {...row, text: sanitized} : row);
		emit(normalizeRows(edited, units, index));
	}

	function handleUnitChange(index: number, unit: DurationFieldUnit) {
		const changed = changeRowUnit(rows, units, index, unit);
		emit(normalizeRows(changed, units, changed.findIndex(row => row.unit === unit)));
	}

	const context: DurationFieldContextValue = {
		rows,
		units,
		locale,
		labelId: label ? labelId : undefined,
		disabled: Boolean(disabled),
		firstInputRef,
		onAmountChange: handleAmountChange,
		onUnitChange: handleUnitChange,
	};

	return (
		<DurationFieldContext.Provider value={context}>
			<FormControl
				variant="outlined"
				fullWidth={fullWidth}
				error={error}
				required={required}
				disabled={disabled}
				size={size}
			>
				{label && <InputLabel shrink id={labelId}>{label}</InputLabel>}
				<OutlinedInput
					notched={Boolean(label)}
					label={label}
					inputComponent={DurationFieldInput}
				/>
				{helperText && <FormHelperText>{helperText}</FormHelperText>}
			</FormControl>
		</DurationFieldContext.Provider>
	);
}

const DurationFieldInput = forwardRef<unknown, InputBaseComponentProps>(
	function DurationFieldInput(props, ref) {
		const {className, onFocus, onBlur} = props;
		const context = useContext(DurationFieldContext);

		useImperativeHandle(ref, () => ({
			focus: () => context?.firstInputRef.current?.focus(),
			value: "",
		}), [context]);

		if (!context) {
			return null;
		}
		return (
			<Box
				className={className}
				role="group"
				aria-labelledby={context.labelId}
				onFocus={onFocus as React.FocusEventHandler<HTMLElement> | undefined}
				onBlur={onBlur as React.FocusEventHandler<HTMLElement> | undefined}
				sx={{
					// bump specificity so the layout wins over the MUI input slot styles
					"&&": {
						height: "auto",
						display: "flex",
						flexWrap: "wrap",
						alignItems: "baseline",
						columnGap: 2,
						rowGap: 1,
					},
				}}
			>
				{context.rows.map((row, index) => <DurationFieldPair key={index} row={row} index={index} />)}
			</Box>
		);
	},
);

function DurationFieldPair({row, index}: { row: DurationFieldRow; index: number }) {
	const {rows, units, locale, disabled, firstInputRef, onAmountChange, onUnitChange} = useContext(
		DurationFieldContext,
	)!;
	const options = getUnitOptions(rows, units, index);
	// use the entered amount for the unit's plural form, defaulting to plural for empty rows
	const count = parseAmount(row.text) ?? 2;

	// Note: The inner controls are wrapped in their own bare FormControls, so they do not
	// register with the outer outlined FormControl (which does not support multiple inputs).
	return (
		<Box sx={{display: "flex", alignItems: "baseline", gap: 0.5}}>
			<FormControl variant="standard" disabled={disabled}>
				<Input
					value={row.text}
					onChange={e => onAmountChange(index, e.target.value)}
					inputRef={index === 0 ? firstInputRef : undefined}
					inputProps={{
						inputMode: "numeric",
						pattern: "[0-9]*",
						"aria-label": formatUnitLabel(locale, row.unit, count, "long"),
					}}
					sx={{width: `${Math.max(3, row.text.length + 1)}ch`}}
				/>
			</FormControl>
			<FormControl variant="standard" disabled={disabled}>
				<Select
					value={row.unit}
					onChange={e => onUnitChange(index, e.target.value as DurationFieldUnit)}
					input={<Input disableUnderline />}
					renderValue={unit => formatUnitLabel(locale, unit as DurationFieldUnit, count, "short")}
				>
					{options.map(option => (
						<MenuItem key={option} value={option}>
							{formatUnitLabel(locale, option, 2, "long")}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Box>
	);
}

const INTL_UNITS: Record<DurationFieldUnit, string> = {
	years: "year",
	months: "month",
	weeks: "week",
	days: "day",
	hours: "hour",
	minutes: "minute",
	seconds: "second",
};

const unitFormatCache = new Map<string, Intl.NumberFormat>();

function formatUnitLabel(locale: string, unit: DurationFieldUnit, count: number, unitDisplay: "short" | "long") {
	const cacheKey = `${locale}/${unit}/${unitDisplay}`;
	let format = unitFormatCache.get(cacheKey);
	if (!format) {
		format = new Intl.NumberFormat(locale, {style: "unit", unit: INTL_UNITS[unit], unitDisplay});
		unitFormatCache.set(cacheKey, format);
	}
	return format.formatToParts(count).find(part => part.type === "unit")?.value ?? unit;
}
