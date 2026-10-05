import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {Box, Button, IconButton, InputAdornment, SxProps, TextField, Theme} from "@mui/material";
import {InputBaseComponentProps} from "@mui/material/InputBase";
import {useForkRef} from "@mui/material/utils";
import * as React from "react";
import {FormEvent, ReactNode, Ref, RefObject, useEffect, useLayoutEffect, useRef, useState} from "react";
import {Labels} from "../localization";

export type CodeFieldLabel = "clear" | "delete" | "showCode" | "hideCode" | "keypad";

const DEFAULT_LABELS: Record<CodeFieldLabel, string> = {
	clear: "Clear",
	delete: "Delete",
	showCode: "Show code",
	hideCode: "Hide code",
	keypad: "Keypad",
};

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * Below this container width, the keypad goes below the field.
 */
const NARROW_WIDTH_REM = 32;

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
	 *
	 * Pass it always or never: switching between the two renders a different root element, which
	 * remounts the component and loses the focus.
	 */
	onSubmit?: () => void;

	/**
	 * Buttons rendered below the field, e.g. *Cancel* and a `type="submit"` *Continue*.
	 * When the keypad goes below the field, they go below the keypad.
	 */
	actions?: ReactNode;

	/**
	 * The maximum length of the code. The digit keys are disabled once it is reached.
	 * Defaults to `inputProps.maxLength`.
	 */
	maxLength?: number;

	/**
	 * Disables the field and the keypad, e.g. while the app checks the code.
	 * If the field had the focus, it gets it back when it becomes enabled again,
	 * unless the focus has moved to another control in the meantime.
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
	 * Labels of the keys, the reveal toggle and the keypad. Defaults to English.
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
	const maxLength = props.maxLength ?? inputProps?.maxLength;

	const rootRef = useRef<HTMLElement>(null);
	const narrow = useNarrow(rootRef);

	const inputRef = useRef<HTMLInputElement>(null);
	const handleInputRef = useForkRef(inputRef, inputRefProp);

	// Whether the field had the focus, kept while it is disabled: disabling a focused input blurs it.
	const focusedRef = useRef(false);

	const [revealed, setRevealed] = useState(false);

	useEffect(() => {
		if (!value) {
			setRevealed(false);
		}
	}, [value]);

	useEffect(() => {
		const input = inputRef.current;
		if (input && !disabled && (autoFocus || (focusedRef.current && !isFocusElsewhere(input)))) {
			input.focus();
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

	function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
		if (!event.target.disabled) {
			focusedRef.current = false;
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
			ref={rootRef}
			component={onSubmit ? "form" : "div"}
			onSubmit={onSubmit ? handleSubmit : undefined}
			className={className}
			sx={[
				{
					display: "grid",
					alignItems: "start",
					gap: 2,
					// keeps the keys at their minimum size of 64px (three keys plus two gaps) in a shrinking container
					minWidth: 3 * 64 + 2 * 8,
					touchAction: "manipulation",
				},
				narrow
					? {
						gridTemplateColumns: "minmax(0, 1fr)",
						gridTemplateAreas: actions ? `"field" "keypad" "actions"` : `"field" "keypad"`,
					}
					: {
						gridTemplateColumns: "minmax(0, 1fr) minmax(0, min(24rem, 50%))",
						gridTemplateRows: actions ? "auto 1fr" : undefined,
						gridTemplateAreas: actions ? `"field keypad" "actions keypad"` : `"field keypad"`,
					},
				...(Array.isArray(sx) ? sx : [sx]),
			]}
		>
			<TextField
				id={id}
				name={name}
				label={label}
				placeholder={placeholder}
				helperText={helperText}
				error={error}
				value={value}
				onChange={e => onChange(e.target.value)}
				onFocus={() => focusedRef.current = true}
				onBlur={handleBlur}
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
							>
								{revealed ? <VisibilityOffIcon /> : <VisibilityIcon />}
							</IconButton>
						</InputAdornment>
					),
				}}
				sx={{gridArea: "field"}}
			/>
			<Box
				role="group"
				aria-label={labels("keypad")}
				sx={{
					gridArea: "keypad",
					display: "grid",
					gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
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
			{actions && (
				<Box sx={{gridArea: "actions", display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: 1}}>
					{actions}
				</Box>
			)}
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
			type="button"
			variant="outlined"
			color="secondary"
			// Hardware keyboard users type digits directly, so the keys stay out of the tab order.
			tabIndex={-1}
			onMouseDown={preventFocusChange}
			onClick={onClick}
			disabled={disabled}
			sx={[
				{minWidth: 0, minHeight: 64, fontSize: "1.5rem"},
				// Translated labels like "Entfernen" must fit narrow keys: hyphenate where the language is
				// known, otherwise wrap instead of clipping.
				text === true && {fontSize: "0.875rem", px: 0.5, hyphens: "auto", overflowWrap: "anywhere"},
			]}
		>
			{children}
		</Button>
	);
}

/**
 * Returns whether the element is narrower than `NARROW_WIDTH_REM`. The first measurement happens before
 * the first paint, so the wide layout never flashes on a narrow screen; later resizes apply a frame later.
 */
function useNarrow(ref: RefObject<HTMLElement>) {
	const [narrow, setNarrow] = useState(false);

	useLayoutEffect(() => {
		const element = ref.current;
		if (!element) {
			return;
		}
		function update() {
			const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
			setNarrow(element!.getBoundingClientRect().width < NARROW_WIDTH_REM * rem);
		}
		update();
		if (typeof ResizeObserver != "undefined") {
			// Switching the layout changes the height of the observed element. Doing that within the
			// notification makes the browser report a "ResizeObserver loop" error, so it waits a frame.
			let frame: number | undefined;
			const observer = new ResizeObserver(() => {
				if (frame === undefined) {
					frame = requestAnimationFrame(() => {
						frame = undefined;
						update();
					});
				}
			});
			observer.observe(element);
			return () => {
				observer.disconnect();
				if (frame !== undefined) {
					cancelAnimationFrame(frame);
				}
			};
		}
	}, [ref]);

	return narrow;
}

/**
 * Returns whether another control than `input` has the focus. A container of the input, e.g. the
 * root of a `Dialog` that took the focus while the input was disabled, doesn't count.
 */
function isFocusElsewhere(input: HTMLInputElement) {
	const active = document.activeElement;
	return active != null && active != document.body && !active.contains(input);
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
