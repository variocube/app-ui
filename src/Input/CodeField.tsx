import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {Box, Button, IconButton, InputAdornment, SxProps, TextField, Theme} from "@mui/material";
import {InputBaseComponentProps} from "@mui/material/InputBase";
import {useForkRef} from "@mui/material/utils";
import * as React from "react";
import {FormEvent, ReactNode, Ref, useEffect, useRef, useState} from "react";
import {Labels} from "../localization";

export type CodeFieldLabel = "clear" | "delete" | "showCode" | "hideCode";

const DEFAULT_LABELS: Record<CodeFieldLabel, string> = {
	clear: "Clear",
	delete: "Delete",
	showCode: "Show code",
	hideCode: "Hide code",
};

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export interface CodeFieldProps {
	/**
	 * The entered code.
	 */
	value: string;

	/**
	 * Called with the new code, for keypad taps as well as for input from a hardware keyboard,
	 * barcode scanner or keypad driver.
	 */
	onChange: (value: string) => void;

	/**
	 * Called when the code is submitted with Enter or a `type="submit"` button in `actions`.
	 * When set, the component renders its own `<form>`, so it must not be placed inside another form.
	 * Without it, Enter submits the enclosing form, if any.
	 */
	onSubmit?: () => void;

	/**
	 * Buttons rendered below the field, e.g. *Cancel* and a `type="submit"` *Continue*.
	 */
	actions?: ReactNode;

	/**
	 * The maximum length of the code. The digit keys are disabled once it is reached.
	 */
	maxLength?: number;

	/**
	 * Disables the field and the keypad, e.g. while the app checks the code.
	 */
	disabled?: boolean;

	/**
	 * Masks the code like a password. Default: `true`.
	 */
	masked?: boolean;

	/**
	 * Shows a toggle to reveal a masked code. Default: `true`.
	 * A revealed code is masked again whenever the value is emptied,
	 * so it doesn't stay revealed for the next person at a shared terminal.
	 */
	revealable?: boolean;

	/**
	 * Lets the field open the OS soft keyboard on focus. Default: `false`, because the keypad
	 * replaces it on touch terminals.
	 */
	softKeyboard?: boolean;

	/**
	 * Focuses the field on mount and whenever it becomes enabled again, so that a barcode scanner
	 * or hardware keyboard can type into it right away.
	 */
	autoFocus?: boolean;

	label?: ReactNode;
	placeholder?: string;
	helperText?: ReactNode;
	error?: boolean;
	id?: string;
	name?: string;

	/**
	 * Attributes applied to the `input` element, e.g. a `data-testid`.
	 */
	inputProps?: InputBaseComponentProps;
	inputRef?: Ref<HTMLInputElement>;

	/**
	 * Labels of the keys and the reveal toggle. Defaults to English.
	 */
	labels?: Labels<CodeFieldLabel>;

	className?: string;
	sx?: SxProps<Theme>;
}

/**
 * A field for entering an access code on a touch terminal: a text field with an on-screen keypad
 * next to it, or below it when its container is narrow. A hardware keyboard, barcode scanner or keypad
 * driver can type into the field as well.
 *
 * The component draws no surface of its own, so it can be placed in a `Card`, `Paper`, `Dialog` or
 * directly on a page.
 */
export function CodeField(props: CodeFieldProps) {
	const {
		value,
		onChange,
		onSubmit,
		actions,
		maxLength,
		disabled = false,
		masked = true,
		revealable = true,
		softKeyboard = false,
		autoFocus = false,
		label,
		placeholder,
		helperText,
		error,
		id,
		name,
		inputProps,
		inputRef: inputRefProp,
		labels = defaultLabels,
		className,
		sx,
	} = props;

	const inputRef = useRef<HTMLInputElement>(null);
	const handleInputRef = useForkRef(inputRef, inputRefProp);

	const [revealed, setRevealed] = useState(false);

	useEffect(() => {
		if (!value) {
			setRevealed(false);
		}
	}, [value]);

	useEffect(() => {
		if (autoFocus && !disabled) {
			inputRef.current?.focus();
		}
	}, [autoFocus, disabled]);

	const full = maxLength !== undefined && value.length >= maxLength;

	function handleKey(next: string) {
		onChange(next);
		if (!softKeyboard) {
			// Keep typing from a scanner or hardware keyboard going into the field. With the soft keyboard
			// enabled, focusing would open it on every tap, so the focus is only kept, not moved.
			inputRef.current?.focus();
		}
	}

	function handleSubmit(event: FormEvent) {
		event.preventDefault();
		if (onSubmit && !disabled) {
			onSubmit();
		}
	}

	const showToggle = masked && revealable;

	return (
		<Box
			component={onSubmit ? "form" : "div"}
			onSubmit={onSubmit ? handleSubmit : undefined}
			className={className}
			sx={[
				{
					display: "flex",
					flexWrap: "wrap",
					alignItems: "flex-start",
					gap: 2,
					touchAction: "manipulation",
				},
				...(Array.isArray(sx) ? sx : [sx]),
			]}
		>
			<Box sx={{flex: "1 1 16rem", minWidth: 0, display: "flex", flexDirection: "column", gap: 2}}>
				<TextField
					id={id}
					name={name}
					label={label}
					placeholder={placeholder}
					helperText={helperText}
					error={error}
					value={value}
					onChange={e => onChange(e.target.value)}
					disabled={disabled}
					type={masked && !revealed ? "password" : "text"}
					autoComplete="off"
					fullWidth
					inputRef={handleInputRef}
					inputProps={{
						...inputProps,
						maxLength,
						inputMode: softKeyboard ? inputProps?.inputMode : "none",
					}}
					InputProps={{
						endAdornment: showToggle && (
							<InputAdornment position="end">
								<IconButton
									edge="end"
									onMouseDown={preventFocusChange}
									onClick={() => setRevealed(prev => !prev)}
									disabled={disabled}
									aria-label={labels(revealed ? "hideCode" : "showCode")}
									aria-pressed={revealed}
								>
									{revealed ? <VisibilityOffIcon /> : <VisibilityIcon />}
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
				{actions && (
					<Box sx={{display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: 1}}>
						{actions}
					</Box>
				)}
			</Box>
			<Box
				sx={{
					flex: "1 1 15rem",
					maxWidth: "24rem",
					display: "grid",
					gridTemplateColumns: "repeat(3, 1fr)",
					gap: 1,
				}}
			>
				{DIGITS.map(digit => (
					<KeypadButton
						key={digit}
						onClick={() => handleKey(value + digit)}
						disabled={disabled || full}
					>
						{digit}
					</KeypadButton>
				))}
				<KeypadButton onClick={() => handleKey("")} disabled={disabled || !value} text>
					{labels("clear")}
				</KeypadButton>
				<KeypadButton onClick={() => handleKey(value + "0")} disabled={disabled || full}>
					0
				</KeypadButton>
				<KeypadButton onClick={() => handleKey(value.slice(0, -1))} disabled={disabled || !value} text>
					{labels("delete")}
				</KeypadButton>
			</Box>
		</Box>
	);
}

interface KeypadButtonProps {
	onClick: () => void;
	disabled: boolean;
	text?: boolean;
	children: ReactNode;
}

function KeypadButton({onClick, disabled, text, children}: KeypadButtonProps) {
	return (
		<Button
			variant="outlined"
			color="secondary"
			// Hardware keyboard users type digits directly, so the keys stay out of the tab order.
			tabIndex={-1}
			onMouseDown={preventFocusChange}
			onClick={onClick}
			disabled={disabled}
			sx={{minWidth: 0, minHeight: 64, fontSize: text ? "1rem" : "1.5rem"}}
		>
			{children}
		</Button>
	);
}

/**
 * Prevents a tap or click from moving the focus away from the field, which would make
 * a scanner or hardware keyboard type into nothing and Enter stop submitting.
 */
function preventFocusChange(event: React.MouseEvent) {
	event.preventDefault();
}

function defaultLabels(key: CodeFieldLabel) {
	return DEFAULT_LABELS[key];
}
