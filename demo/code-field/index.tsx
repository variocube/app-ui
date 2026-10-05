import {
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Container,
	Dialog,
	DialogContent,
	DialogTitle,
	FormControlLabel,
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
				lets people enter an access code on a touch terminal without a hardware keyboard: a text field with an
				on-screen keypad next to it. When its container is narrow, the keypad goes below the field. A hardware
				keyboard, barcode scanner or keypad driver can still type into the field. The component draws no surface
				of its own, so it fits into a <Code>Card</Code>, <Code>Paper</Code>, <Code>Dialog</Code>{" "}
				or directly onto a page. Use the theme switch in the app bar to see it in light and dark mode.
			</Typography>

			<Stack spacing={8} mt={4}>
				<BasicDemo />
				<VerifyDemo />
				<EmbeddingDemo />
				<ResponsiveDemo />
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
				The value is controlled with <Code>value</Code> and <Code>onChange</Code>. With <Code>onSubmit</Code>
				{" "}
				the component renders its own form: pressing Enter or a <Code>type="submit"</Code> button in{" "}
				<Code>actions</Code>{" "}
				submits the code. Enter does nothing while the submit button is disabled, the same as in any HTML form.
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
							actions={
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

	return (
		<Box>
			<Typography variant="h2" gutterBottom>Checking a code</Typography>
			<Typography variant="subtitle1" gutterBottom>
				The component doesn't check codes itself; the app owns that state. The recommended pattern: disable the
				component while the check runs, clear the code when it fails and show why in{" "}
				<Code>helperText</Code>, then clear the error on the next keypress. If the field had the focus, it gets
				it back after the check, so a scanner can type the next code right away. The demo accepts{" "}
				<Code>1234</Code>.
			</Typography>
			<Demo source={source} id="code-field-verify">
				<Box p={2}>
					<DemoSource for="#code-field-verify">
						<CodeField
							label="Code"
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
							helperText={checking
								? "Checking code…"
								: invalid
								? "Invalid code. Please try again."
								: "Please enter your code."}
							actions={
								<Button type="submit" variant="contained" disabled={checking || !code}>
									Continue
								</Button>
							}
						/>
					</DemoSource>
					{opened && <Alert severity="success" sx={{mt: 2}}>Code accepted, the door opens.</Alert>}
				</Box>
			</Demo>
		</Box>
	);
}

function EmbeddingDemo() {
	const [cardCode, setCardCode] = useState("");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogCode, setDialogCode] = useState("");
	const [checking, setChecking] = useState(false);
	const [invalid, setInvalid] = useState(false);

	function closeDialog() {
		setDialogOpen(false);
		setDialogCode("");
		setInvalid(false);
	}

	async function handleDialogSubmit() {
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
	}

	return (
		<Box>
			<Typography variant="h2" gutterBottom>Embedding</Typography>
			<Typography variant="subtitle1" gutterBottom>
				Inside a <Code>Card</Code> or <Code>Paper</Code>, the component takes its width from the container. In a
				{" "}
				<Code>Dialog</Code>, <Code>actions</Code> holds <em>Cancel</em> and <em>Login</em>. The dialog uses{" "}
				<Code>autoFocus</Code>: the field gets the focus when the dialog opens, so a scanner can type into it
				right away. <em>Cancel</em>{" "}
				is disabled during the check, so a late result can't show up in a closed dialog. The demos above show
				the component directly on a page.
			</Typography>
			<Demo source={source} id="code-field-embedding">
				<Stack spacing={2} p={2}>
					<DemoSource for="#code-field-embedding">
						<Card>
							<CardHeader title="Pick up your parcel" />
							<CardContent>
								<CodeField label="Pickup code" value={cardCode} onChange={setCardCode} />
							</CardContent>
						</Card>

						<Button variant="outlined" onClick={() => setDialogOpen(true)}>
							Open dialog
						</Button>
						<Dialog open={dialogOpen} onClose={checking ? undefined : closeDialog} maxWidth="sm" fullWidth>
							<DialogTitle>Technician login</DialogTitle>
							<DialogContent>
								<CodeField
									label="PIN"
									value={dialogCode}
									onChange={code => {
										setDialogCode(code);
										setInvalid(false);
									}}
									onSubmit={handleDialogSubmit}
									disabled={checking}
									error={invalid}
									helperText={invalid ? "Invalid PIN" : " "}
									autoFocus
									sx={{pt: 1}}
									actions={
										<>
											<Button onClick={closeDialog} disabled={checking}>Cancel</Button>
											<Button
												type="submit"
												variant="contained"
												disabled={checking || !dialogCode}
											>
												Login
											</Button>
										</>
									}
								/>
							</DialogContent>
						</Dialog>
					</DemoSource>
				</Stack>
			</Demo>
		</Box>
	);
}

type DemoWidth = "320px" | "480px" | "100%";

function ResponsiveDemo() {
	const [width, setWidth] = useState<DemoWidth>("320px");
	const [code, setCode] = useState("");

	return (
		<Box>
			<Typography variant="h2" gutterBottom>Responsive layout</Typography>
			<Typography variant="subtitle1" gutterBottom>
				The layout follows the width of the container, not the viewport: the keypad sits to the right of the
				field when there is room, and goes below it otherwise. This also works in a narrow dialog or column on a
				wide screen.
			</Typography>
			<Demo source={source} id="code-field-responsive">
				<Box p={2}>
					<DemoSource for="#code-field-responsive">
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
						<ToggleButton value="320px">320 px</ToggleButton>
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
};

function OptionsDemo() {
	const [code, setCode] = useState("");
	const [maxLength, setMaxLength] = useState<number>();
	const [disabled, setDisabled] = useState(false);
	const [masked, setMasked] = useState(true);
	const [revealable, setRevealable] = useState(true);
	const [softKeyboard, setSoftKeyboard] = useState(false);
	const [german, setGerman] = useState(false);

	return (
		<Box>
			<Typography variant="h2" gutterBottom>Options</Typography>
			<Typography variant="subtitle1" gutterBottom>
				<Code>maxLength</Code> disables the digit keys once the code is complete. <Code>masked</Code>{" "}
				(default on) hides the code like a password, and <Code>revealable</Code>{" "}
				(default on) adds a toggle to show it. A revealed code is masked again when the value is emptied, so it
				doesn't stay revealed for the next person. <Code>softKeyboard</Code>{" "}
				(default off) lets the field open the OS soft keyboard. <Code>labels</Code>{" "}
				overrides the English key and toggle labels, typically with the app's own translations.
			</Typography>
			<Demo source={source} id="code-field-options">
				<Box p={2}>
					<DemoSource for="#code-field-options">
						<CodeField
							label="Code"
							value={code}
							onChange={setCode}
							maxLength={maxLength}
							disabled={disabled}
							masked={masked}
							revealable={revealable}
							softKeyboard={softKeyboard}
							labels={german ? (key => GERMAN_LABELS[key]) : undefined}
						/>
					</DemoSource>
				</Box>
				<DemoControls>
					<Stack direction="row" flexWrap="wrap" alignItems="center" columnGap={2} rowGap={1}>
						<TextField
							select
							size="small"
							label="maxLength"
							value={maxLength ?? ""}
							onChange={e => setMaxLength(e.target.value ? Number(e.target.value) : undefined)}
							sx={{minWidth: 140}}
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
			<Typography variant="h2" gutterBottom>Hardware input</Typography>
			<Typography variant="subtitle1" gutterBottom>
				The keypad is an extra input method, not the only one. Click into the field, type on your keyboard and
				tap keys on the keypad in between: the keys don't take the focus, so typing continues in the field and
				Enter still submits. A barcode scanner that ends a scan with Enter submits the same way. Here the code
				isn't masked, so you can see which input went where.
			</Typography>
			<Demo source={source} id="code-field-hardware">
				<Box p={2}>
					<DemoSource for="#code-field-hardware">
						<CodeField
							label="Item code"
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
