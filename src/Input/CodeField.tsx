import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
	Box,
	Button,
	IconButton,
	InputAdornment,
	Paper,
	Popper,
	PopperProps,
	SxProps,
	TextField,
	Theme,
} from "@mui/material";
import {InputBaseComponentProps} from "@mui/material/InputBase";
import {unstable_useId as useId, useForkRef} from "@mui/material/utils";
import * as React from "react";
import {FormEvent, ReactNode, Ref, useEffect, useRef, useState} from "react";
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
 * Three keys of 64px plus two gaps.
 */
const KEYPAD_MIN_WIDTH = 3 * 64 + 2 * 8;

export interface CodeFieldProps {
	/**
	 * The entered code.
	 */
	value: string;

	/**
	 * Called with the new code, for keypad taps as well as for input from a hardware keyboard.
	 */
	onChange: (value: string) => void;

	/**
	 * Called when the code is submitted with Enter or a `type="submit"` button as `action`.
	 * When set, the component renders its own `<form>`, so it must not be placed inside another form.
	 * Without it, Enter submits the enclosing form, if any.
	 *
	 * Pass it always or never: switching between the two renders a different root element, which
	 * remounts the component and loses the focus.
	 */
	onSubmit?: () => void;

	/**
	 * A control rendered inside the field at its right edge, typically a `type="submit"` *Continue* button.
	 * Tapping it keeps the focus in the field, so the field gets the focus back, and the keypad opens again,
	 * after a failed check.
	 */
	action?: ReactNode;

	/**
	 * How the keypad is shown:
	 * - `popup` (default): in a pop-up below the field, as wide as the field, while the field has the focus and is
	 *   enabled. Escape closes it; tapping the field opens it again.
	 * - `inline`: always below the field, taking up its space.
	 */
	keypad?: "popup" | "inline";

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
	 * Lets the field open the OS soft keyboard on focus, e.g. on a tablet. Default: `false`, because the
	 * keypad replaces it.
	 */
	softKeyboard?: boolean;

	/**
	 * Focuses the field on mount, which opens the pop-up keypad, and whenever it becomes enabled again.
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
 * A field for entering an access code on a touch terminal, with an on-screen keypad that pops up below the
 * field while it has the focus, or stays below it permanently. A hardware keyboard can type into the field
 * as well.
 *
 * The component draws no surface of its own, so it can be placed in a `Card`, `Paper`, `Dialog` or
 * directly on a page.
 */
export function CodeField(props: CodeFieldProps) {
	const {
		value,
		onChange,
		onSubmit,
		action,
		keypad = "popup",
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

	const fieldRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const handleInputRef = useForkRef(inputRef, inputRefProp);

	const popup = keypad == "popup";
	const keypadId = useId();
	const [popupOpen, setPopupOpen] = useState(false);
	const showPopup = popup && popupOpen && !disabled;
	const popperRef = useRef<PopperInstance>(null);

	useEffect(() => {
		const field = fieldRef.current;
		if (showPopup && field && typeof ResizeObserver != "undefined") {
			// Popper only follows scrolling and window resizes, not a field that changes its width with its container.
			const observer = new ResizeObserver(() => popperRef.current?.update());
			observer.observe(field);
			return () => observer.disconnect();
		}
	}, [showPopup]);

	useEffect(() => {
		if (disabled) {
			setPopupOpen(false);
		}
	}, [disabled]);

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
			// Opened explicitly: a browser that keeps the focus on a disabled input fires no focus event here.
			// Only when the focus arrived, though: a hidden field can't take it and would never close the keypad.
			if (document.activeElement === input) {
				setPopupOpen(true);
			}
		}
	}, [autoFocus, disabled]);

	const full = maxLength !== undefined && value.length >= maxLength;

	function handleKey(next: string) {
		onChange(next);
		if (!softKeyboard) {
			// Keep the focus in the field, as a fallback should a tap have moved it: the pop-up closes without
			// it, and a hardware keyboard would type into nothing. With the soft keyboard enabled, focusing would
			// open it on every tap, so the focus is only kept, not moved.
			inputRef.current?.focus();
		}
	}

	function handleFocus() {
		focusedRef.current = true;
		setPopupOpen(true);
	}

	function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
		setPopupOpen(false);
		if (!event.target.disabled) {
			focusedRef.current = false;
		}
	}

	function handleFieldClick(event: React.MouseEvent) {
		// Opens the keypad again after Escape or Enter closed it. A tap on the reveal toggle or the action
		// doesn't open it. Neither does a tap while disabled: the disabled toggle lets taps through to the field,
		// and the keypad would open once the field is enabled again.
		if (!disabled && !(event.target as Element).closest("button")) {
			inputRef.current?.focus();
			setPopupOpen(true);
		}
	}

	function handleKeyDown(event: React.KeyboardEvent) {
		if (event.key == "Escape" && showPopup) {
			// close only the keypad, not an enclosing dialog
			event.stopPropagation();
			setPopupOpen(false);
		}
	}

	function handleSubmit(event: FormEvent) {
		event.preventDefault();
		if (onSubmit && !disabled) {
			onSubmit();
		}
	}

	const keypadElement = (
		<Keypad
			id={keypadId}
			value={value}
			full={full}
			disabled={disabled}
			labels={labels}
			onKey={handleKey}
		/>
	);

	const showToggle = masked && revealable;

	return (
		<Box
			component={onSubmit ? "form" : "div"}
			onSubmit={onSubmit ? handleSubmit : undefined}
			className={className}
			sx={[
				{touchAction: "manipulation"},
				!popup && {
					display: "flex",
					flexDirection: "column",
					gap: 2,
					// keeps the keys at their minimum size of 64px in a shrinking container
					minWidth: KEYPAD_MIN_WIDTH,
				},
				...(Array.isArray(sx) ? sx : [sx]),
			]}
		>
			<TextField
				ref={fieldRef}
				id={id}
				name={name}
				label={label}
				placeholder={placeholder}
				helperText={helperText}
				error={error}
				value={value}
				onChange={e => onChange(e.target.value)}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
				disabled={disabled}
				type={masked && !revealed ? "password" : "text"}
				autoComplete="off"
				fullWidth
				inputRef={handleInputRef}
				inputProps={{
					...inputProps,
					maxLength,
					inputMode: softKeyboard ? inputProps?.inputMode : "none",
					"aria-controls": showPopup ? keypadId : inputProps?.["aria-controls"],
				}}
				InputProps={{
					onClick: popup ? handleFieldClick : undefined,
					endAdornment: (showToggle || action) && (
						<InputAdornment position="end">
							{showToggle && (
								<IconButton
									edge={action ? undefined : "end"}
									onMouseDown={preventFocusChange}
									onClick={() => setRevealed(prev => !prev)}
									disabled={disabled}
									aria-label={labels(revealed ? "hideCode" : "showCode")}
								>
									{revealed ? <VisibilityOffIcon /> : <VisibilityIcon />}
								</IconButton>
							)}
							{action && (
								<Box onMouseDown={preventFocusChange} sx={{display: "flex", ml: 1, mr: -0.75}}>
									{action}
								</Box>
							)}
						</InputAdornment>
					),
				}}
			/>
			{popup
				? (
					<Popper
						open={showPopup}
						// The whole text field, so that the keypad doesn't cover the helper text, e.g. an error.
						anchorEl={fieldRef.current}
						popperRef={popperRef}
						placement="bottom-start"
						// MUI's default `tooltip` role must not contain interactive controls
						role="presentation"
						modifiers={POPPER_MODIFIERS}
						// above an enclosing dialog
						sx={{zIndex: theme => theme.zIndex.modal + 1}}
					>
						<Paper
							elevation={8}
							// a tap between the keys must not take the focus from the field either
							onMouseDown={preventFocusChange}
							sx={{p: 1, minWidth: KEYPAD_MIN_WIDTH + 16, touchAction: "manipulation"}}
						>
							{keypadElement}
						</Paper>
					</Popper>
				)
				: keypadElement}
		</Box>
	);
}

type PopperModifier = NonNullable<PopperProps["modifiers"]>[number];
type PopperInstance = NonNullable<Extract<PopperProps["popperRef"], { current: unknown }>["current"]>;

const POPPER_MODIFIERS: PopperModifier[] = [
	{name: "offset", options: {offset: [0, 8]}},
	{
		// makes the pop-up as wide as the field
		name: "sameWidth",
		enabled: true,
		phase: "beforeWrite",
		requires: ["computeStyles"],
		fn: ({state}) => {
			state.styles.popper.width = `${state.rects.reference.width}px`;
		},
		effect: ({state}) => {
			state.elements.popper.style.width = `${(state.elements.reference as HTMLElement).offsetWidth}px`;
		},
	},
];

interface KeypadProps {
	id: string | undefined;
	value: string;
	full: boolean;
	disabled: boolean;
	labels: Labels<CodeFieldLabel>;
	onKey: (next: string) => void;
}

function Keypad({id, value, full, disabled, labels, onKey}: KeypadProps) {
	return (
		<Box
			id={id}
			role="group"
			aria-label={labels("keypad")}
			sx={{
				display: "grid",
				gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
				gap: 1,
			}}
		>
			{DIGITS.map(digit => (
				<KeypadButton
					key={digit}
					onClick={() => onKey(value + digit)}
					disabled={disabled || full}
				>
					{digit}
				</KeypadButton>
			))}
			<KeypadButton onClick={() => onKey("")} disabled={disabled || !value} text>
				{labels("clear")}
			</KeypadButton>
			<KeypadButton onClick={() => onKey(value + "0")} disabled={disabled || full}>
				0
			</KeypadButton>
			<KeypadButton onClick={() => onKey(value.slice(0, -1))} disabled={disabled || !value} text>
				{labels("delete")}
			</KeypadButton>
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
 * Returns whether another control than `input` has the focus. A container of the input, e.g. the
 * root of a `Dialog` that took the focus while the input was disabled, doesn't count.
 */
function isFocusElsewhere(input: HTMLInputElement) {
	const active = document.activeElement;
	return active != null && active != document.body && !active.contains(input);
}

/**
 * Prevents a tap or click from moving the focus away from the field, which would close the pop-up keypad
 * and make a hardware keyboard type into nothing.
 */
function preventFocusChange(event: React.MouseEvent) {
	event.preventDefault();
}

function defaultLabels(key: CodeFieldLabel) {
	return DEFAULT_LABELS[key];
}
