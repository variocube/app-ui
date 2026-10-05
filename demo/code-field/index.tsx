import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	CircularProgress,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	IconButton,
	MenuItem,
	Paper,
	Stack,
	Switch,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from "@mui/material";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {Code, CodeField, CodeFieldLabel, PageTitle} from "../../src";
import {Demo, DemoControls, DemoSource} from "../demo";

// @ts-ignore
import source from "./index.tsx?source";

export function CodeFieldDemo() {
	return (
		<Container maxWidth="md">
			<PageTitle title="Code field" gutterBottom />
			<Typography variant="subtitle1" gutterBottom>
				<Code>CodeField</Code>{" "}
				lets people enter an access code on a touch terminal without a hardware keyboard. While the field has
				the focus, an on-screen keypad pops up below it, as wide as the field. Optionally, the keypad stays
				below the field permanently. A hardware keyboard can type into the field as well. The component draws no
				surface of its own, so it fits into a <Code>Card</Code>, <Code>Paper</Code>, <Code>Dialog</Code>{" "}
				or directly onto a page. Use the theme switch in the app bar to see it in light and dark mode.
			</Typography>

			<Stack spacing={8} mt={4}>
				<BasicDemo />
				<VerifyDemo />
				<LargeDemo />
				<InlineDemo />
				<DialogDemo />
				<WidthDemo />
				<OptionsDemo />
				<HardwareInputDemo />
			</Stack>
		</Container>
	);
}

function BasicDemo() {
	const [code, setCode] = useState("");
	const [submitted, setSubmitted] = useState<string>();

	return (
		<Box>
			<Typography variant="h2" gutterBottom>Basic use</Typography>
			<Typography variant="subtitle1" gutterBottom>
				The value is controlled with <Code>value</Code> and{" "}
				<Code>onChange</Code>. Tap the field to open the keypad; it stays open while the field has the focus,
				and Escape closes it. <Code>action</Code>{" "}
				renders a control inside the field at its right edge, typically the <Code>type="submit"</Code>{" "}
				button. With <Code>onSubmit</Code>{" "}
				the component renders its own form: pressing Enter or the submit button submits the code. Enter does
				nothing while the submit button is disabled, the same as in any HTML form.
			</Typography>
			<Demo source={source} id="code-field-basic">
				<Box p={2}>
					<DemoSource for="#code-field-basic">
						<CodeField
							label="Code"
							value={code}
							onChange={setCode}
							onSubmit={() => {
								setSubmitted(code);
								setCode("");
							}}
							action={
								<Button type="submit" variant="contained" disabled={!code}>
									Continue
								</Button>
							}
						/>
					</DemoSource>
					{submitted !== undefined && (
						<Typography variant="body2" mt={2}>
							Submitted: <Code>{submitted}</Code>
						</Typography>
					)}
				</Box>
			</Demo>
		</Box>
	);
}

/** Simulates the backend: accepts `1234` after a delay. */
function checkCode(code: string) {
	return new Promise<boolean>(resolve => setTimeout(() => resolve(code == "1234"), 1000));
}

function VerifyDemo() {
	const [code, setCode] = useState("");
	const [checking, setChecking] = useState(false);
	const [invalid, setInvalid] = useState(false);
	const [opened, setOpened] = useState(false);
	const [autoFocus, setAutoFocus] = useState(false);

	return (
		<Box>
			<Typography variant="h2" gutterBottom>Checking a code</Typography>
			<Typography variant="subtitle1" gutterBottom>
				The component doesn't check codes itself; the app owns that state. The recommended pattern: disable the
				component while the check runs, clear the code when it fails and show why in{" "}
				<Code>status</Code>, then clear the status on the next keypress. <Code>status</Code>{" "}
				shows the message inside the field, where people look, and the field keeps its height, so the keypad
				doesn't move. Tapping the action keeps the focus in the field, so after a failed check the field gets
				the focus back and the keypad opens again for the next attempt. The demo accepts <Code>1234</Code>.
			</Typography>
			<Demo source={source} id="code-field-verify">
				<Stack spacing={2} p={2}>
					<DemoSource for="#code-field-verify">
						<Card>
							<CardHeader title="Pick up your parcel" subheader="Enter your pickup code." />
							<CardContent>
								<CodeField
									label="Pickup code"
									value={code}
									onChange={value => {
										setCode(value);
										setInvalid(false); // the error goes away on the next keypress
									}}
									onSubmit={async () => {
										setChecking(true); // disables the component during the check
										const valid = await checkCode(code);
										setChecking(false);
										setCode(""); // the next attempt starts empty
										setInvalid(!valid);
										setOpened(valid);
									}}
									disabled={checking}
									error={invalid}
									status={checking
										? (
											<>
												<CircularProgress size="1em" color="inherit" />
												Checking code…
											</>
										)
										: invalid
										? "Invalid code. Please try again."
										: undefined}
									autoFocus={autoFocus}
									action={
										<Button type="submit" variant="contained" disabled={checking || !code}>
											Continue
										</Button>
									}
								/>
							</CardContent>
						</Card>
					</DemoSource>
					{opened && <Alert severity="success">Code accepted, the door opens.</Alert>}
				</Stack>
				<DemoControls>
					<DemoSwitch label="autoFocus" checked={autoFocus} onChange={setAutoFocus} />
					<Typography variant="body2" color="text.secondary">
						Focuses the field, which opens the keypad, when a start screen appears. Off by default here, so
						the page doesn't scroll to this demo when it loads.
					</Typography>
				</DemoControls>
			</Demo>
		</Box>
	);
}

function LargeDemo() {
	const [code, setCode] = useState("");
	const [checking, setChecking] = useState(false);
	const [invalid, setInvalid] = useState(false);

	return (
		<Box>
			<Typography variant="h2" gutterBottom>Large size</Typography>
			<Typography variant="subtitle1" gutterBottom>
				<Code>size="large"</Code>{" "}
				enlarges the field and its text, e.g. for a kiosk start screen. The keypad keeps its size. A large{" "}
				<Code>action</Code> fits well, e.g. a <Code>Button</Code> with <Code>size="large"</Code>.
			</Typography>
			<Demo source={source} id="code-field-large">
				<Box p={2}>
					<DemoSource for="#code-field-large">
						<CodeField
							size="large"
							label="Pickup code"
							value={code}
							onChange={value => {
								setCode(value);
								setInvalid(false);
							}}
							onSubmit={async () => {
								setChecking(true);
								const valid = await checkCode(code);
								setChecking(false);
								setCode("");
								setInvalid(!valid);
							}}
							disabled={checking}
							error={invalid}
							status={checking
								? (
									<>
										<CircularProgress size="1em" color="inherit" />
										Checking code…
									</>
								)
								: invalid
								? "Invalid code. Please try again."
								: undefined}
							action={
								<Button type="submit" variant="contained" size="large" disabled={checking || !code}>
									Continue
								</Button>
							}
						/>
					</DemoSource>
				</Box>
			</Demo>
		</Box>
	);
}

function InlineDemo() {
	const [pin, setPin] = useState("");

	return (
		<Box>
			<Typography variant="h2" gutterBottom>Inline keypad</Typography>
			<Typography variant="subtitle1" gutterBottom>
				With <Code>keypad="inline"</Code>{" "}
				the keypad stays below the field permanently and takes up its space, for screens that are only about
				entering a code.
			</Typography>
			<Demo source={source} id="code-field-inline">
				<Box p={2} maxWidth={400}>
					<DemoSource for="#code-field-inline">
						<CodeField
							keypad="inline"
							label="PIN"
							value={pin}
							onChange={setPin}
							onSubmit={() => setPin("")}
							action={
								<Button type="submit" variant="contained" disabled={!pin}>
									Login
								</Button>
							}
						/>
					</DemoSource>
				</Box>
			</Demo>
		</Box>
	);
}

function DialogDemo() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogCode, setDialogCode] = useState("");
	const [checking, setChecking] = useState(false);
	const [invalid, setInvalid] = useState(false);

	function closeDialog() {
		setDialogOpen(false);
		setDialogCode("");
		setInvalid(false);
	}

	return (
		<Box>
			<Typography variant="h2" gutterBottom>Dialog</Typography>
			<Typography variant="subtitle1" gutterBottom>
				The pop-up keypad covers what is below the field, e.g. a dialog's actions. In a <Code>Dialog</Code>{" "}
				with actions, the inline keypad avoids that. The pop-up keypad works in dialogs as well: it stays above
				the dialog, and Escape first closes the keypad, then the dialog. <em>Cancel</em>{" "}
				is disabled during the check, so a late result can't show up in a closed dialog.
			</Typography>
			<Demo source={source} id="code-field-dialog">
				<Box p={2}>
					<DemoSource for="#code-field-dialog">
						<Button variant="outlined" onClick={() => setDialogOpen(true)}>
							Open dialog
						</Button>
						<Dialog open={dialogOpen} onClose={checking ? undefined : closeDialog} maxWidth="xs" fullWidth>
							<DialogTitle>Technician login</DialogTitle>
							<DialogContent>
								<CodeField
									label="PIN"
									value={dialogCode}
									onChange={code => {
										setDialogCode(code);
										setInvalid(false);
									}}
									onSubmit={async () => {
										setChecking(true);
										const valid = await checkCode(dialogCode);
										setChecking(false);
										if (valid) {
											closeDialog();
										}
										else {
											setDialogCode("");
											setInvalid(true);
										}
									}}
									disabled={checking}
									error={invalid}
									status={invalid ? "Invalid PIN" : undefined}
									keypad="inline"
									autoFocus
									sx={{pt: 1}}
									action={
										<Button type="submit" variant="contained" disabled={checking || !dialogCode}>
											Login
										</Button>
									}
								/>
							</DialogContent>
							<DialogActions>
								<Button onClick={closeDialog} disabled={checking}>Cancel</Button>
							</DialogActions>
						</Dialog>
					</DemoSource>
				</Box>
			</Demo>
		</Box>
	);
}

type DemoWidth = "280px" | "480px" | "100%";

function WidthDemo() {
	const [width, setWidth] = useState<DemoWidth>("280px");
	const [code, setCode] = useState("");

	return (
		<Box>
			<Typography variant="h2" gutterBottom>Width</Typography>
			<Typography variant="subtitle1" gutterBottom>
				The component takes its width from the container, and the pop-up keypad is always as wide as the field.
				Below 224 px, the keys would get smaller than 64 px, so the keypad keeps that minimum width.
			</Typography>
			<Demo source={source} id="code-field-width">
				<Box p={2}>
					<DemoSource for="#code-field-width">
						<Paper variant="outlined" sx={{width, p: 2}}>
							<CodeField label="Code" value={code} onChange={setCode} />
						</Paper>
					</DemoSource>
				</Box>
				<DemoControls>
					<ToggleButtonGroup
						exclusive
						size="small"
						value={width}
						onChange={(_, value: DemoWidth | null) => value && setWidth(value)}
						aria-label="Container width"
					>
						<ToggleButton value="280px">280 px</ToggleButton>
						<ToggleButton value="480px">480 px</ToggleButton>
						<ToggleButton value="100%">100 %</ToggleButton>
					</ToggleButtonGroup>
				</DemoControls>
			</Demo>
		</Box>
	);
}

const GERMAN_LABELS: Record<CodeFieldLabel, string> = {
	clear: "Löschen",
	delete: "Entfernen",
	showCode: "Code anzeigen",
	hideCode: "Code verbergen",
	keypad: "Tastenfeld",
};

type DemoAction = "none" | "button" | "icon";

function OptionsDemo() {
	const [code, setCode] = useState("");
	const [keypad, setKeypad] = useState<"popup" | "inline">("popup");
	const [actionType, setActionType] = useState<DemoAction>("button");
	const [maxLength, setMaxLength] = useState<number>();
	const [disabled, setDisabled] = useState(false);
	const [masked, setMasked] = useState(true);
	const [revealable, setRevealable] = useState(true);
	const [softKeyboard, setSoftKeyboard] = useState(false);
	const [size, setSize] = useState<"medium" | "large">("medium");
	const [showStatus, setShowStatus] = useState(false);
	const [error, setError] = useState(false);
	const [german, setGerman] = useState(false);

	const action = actionType == "button"
		? <Button type="submit" variant="contained" disabled={!code}>Continue</Button>
		: actionType == "icon"
		? (
			<IconButton type="submit" color="primary" disabled={!code} aria-label="Enter">
				<KeyboardReturnIcon />
			</IconButton>
		)
		: undefined;

	return (
		<Box>
			<Typography variant="h2" gutterBottom>Options</Typography>
			<Typography variant="subtitle1" gutterBottom>
				<Code>keypad</Code>{" "}
				shows the keypad in a pop-up (<Code>popup</Code>, the default) or permanently below the field (<Code>
					inline
				</Code>). <Code>action</Code> can be any control, e.g. a button or an icon button.{" "}
				<Code>maxLength</Code> disables the digit keys once the code is complete. <Code>masked</Code>{" "}
				(default on) hides the code like a password, and <Code>revealable</Code>{" "}
				(default on) adds a toggle to show it. A revealed code is masked again when the value is emptied, so it
				doesn't stay revealed for the next person. <Code>softKeyboard</Code>{" "}
				(default off) lets the field open the OS soft keyboard, e.g. on a tablet. <Code>labels</Code>{" "}
				overrides the English key and toggle labels, typically with the app's own translations.{" "}
				<Code>size</Code> enlarges the field. <Code>status</Code>{" "}
				shows a message inside the field instead of the code, in the error color with <Code>error</Code>
				; <Code>helperText</Code> remains for a hint below the field.
			</Typography>
			<Demo source={source} id="code-field-options">
				<Box p={2}>
					<DemoSource for="#code-field-options">
						<CodeField
							label="Code"
							value={code}
							onChange={setCode}
							onSubmit={() =>
								setCode("")}
							action={action}
							keypad={keypad}
							maxLength={maxLength}
							disabled={disabled}
							masked={masked}
							revealable={revealable}
							softKeyboard={softKeyboard}
							size={size}
							status={showStatus ? "Invalid code. Please try again." : undefined}
							error={error}
							helperText="A hint below the field"
							labels={german ? (key => GERMAN_LABELS[key]) : undefined}
						/>
					</DemoSource>
				</Box>
				<DemoControls>
					<Stack direction="row" flexWrap="wrap" alignItems="center" columnGap={2} rowGap={1}>
						<TextField
							select
							size="small"
							label="keypad"
							value={keypad}
							onChange={e => setKeypad(e.target.value as "popup" | "inline")}
							sx={{minWidth: 120}}
						>
							<MenuItem value="popup">popup</MenuItem>
							<MenuItem value="inline">inline</MenuItem>
						</TextField>
						<TextField
							select
							size="small"
							label="action"
							value={actionType}
							onChange={e => setActionType(e.target.value as DemoAction)}
							sx={{minWidth: 120}}
						>
							<MenuItem value="none">none</MenuItem>
							<MenuItem value="button">button</MenuItem>
							<MenuItem value="icon">icon button</MenuItem>
						</TextField>
						<TextField
							select
							size="small"
							label="size"
							value={size}
							onChange={e => setSize(e.target.value as "medium" | "large")}
							sx={{minWidth: 120}}
						>
							<MenuItem value="medium">medium</MenuItem>
							<MenuItem value="large">large</MenuItem>
						</TextField>
						<TextField
							select
							size="small"
							label="maxLength"
							value={maxLength ?? ""}
							onChange={e => setMaxLength(e.target.value ? Number(e.target.value) : undefined)}
							sx={{minWidth: 120}}
						>
							<MenuItem value="">none</MenuItem>
							<MenuItem value="4">4</MenuItem>
							<MenuItem value="6">6</MenuItem>
							<MenuItem value="8">8</MenuItem>
						</TextField>
						<DemoSwitch label="disabled" checked={disabled} onChange={setDisabled} />
						<DemoSwitch label="masked" checked={masked} onChange={setMasked} />
						<DemoSwitch label="revealable" checked={revealable} onChange={setRevealable} />
						<DemoSwitch label="softKeyboard" checked={softKeyboard} onChange={setSoftKeyboard} />
						<DemoSwitch label="German labels" checked={german} onChange={setGerman} />
						<DemoSwitch label="status" checked={showStatus} onChange={setShowStatus} />
						<DemoSwitch label="error" checked={error} onChange={setError} />
					</Stack>
				</DemoControls>
			</Demo>
		</Box>
	);
}

interface DemoSwitchProps {
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
}

function DemoSwitch({label, checked, onChange}: DemoSwitchProps) {
	return (
		<FormControlLabel
			label={label}
			control={<Switch checked={checked} onChange={e => onChange(e.target.checked)} />}
		/>
	);
}

function HardwareInputDemo() {
	const [code, setCode] = useState("");
	const [submitted, setSubmitted] = useState<string>();
	const inputRef = useRef<HTMLInputElement>(null);
	const focused = useFocused(inputRef);

	return (
		<Box>
			<Typography variant="h2" gutterBottom>Hardware keyboard</Typography>
			<Typography variant="subtitle1" gutterBottom>
				The keypad is an extra input method, not the only one, e.g. for a technician with a laptop. Click into
				the field, type on your keyboard and tap keys on the keypad in between: the keys don't take the focus,
				so the keypad stays open, typing continues in the field and Enter still submits. Here the code isn't
				masked, so you can see which input went where.
			</Typography>
			<Demo source={source} id="code-field-hardware">
				<Box p={2}>
					<DemoSource for="#code-field-hardware">
						<CodeField
							label="Code"
							value={code}
							onChange={setCode}
							onSubmit={() => {
								setSubmitted(code);
								setCode("");
							}}
							masked={false}
							inputRef={inputRef}
						/>
					</DemoSource>
					<Typography variant="body2" mt={2}>
						Field has the focus: <Code>{focused ? "yes" : "no"}</Code>
					</Typography>
					{submitted !== undefined && (
						<Typography variant="body2">
							Submitted: <Code>{submitted}</Code>
						</Typography>
					)}
				</Box>
			</Demo>
		</Box>
	);
}

function useFocused(ref: React.RefObject<HTMLElement>) {
	const [focused, setFocused] = useState(false);
	useEffect(() => {
		const update = () => setFocused(document.activeElement != null && document.activeElement === ref.current);
		document.addEventListener("focusin", update);
		document.addEventListener("focusout", update);
		return () => {
			document.removeEventListener("focusin", update);
			document.removeEventListener("focusout", update);
		};
	}, [ref]);
	return focused;
}
