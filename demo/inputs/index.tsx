import {
	Alert,
	Box,
	BoxProps,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Container,
	Grid,
	MenuItem,
	Stack,
	Typography,
} from "@mui/material";
import React, {useState} from "react";
import {
	ActionMenuItem,
	ActionsMenu,
	Checkbox,
	Code,
	CountrySelect,
	IntegerNumberFormat,
	LocaleSelect,
	NumberField,
	PageTitle,
	PhonePrefixSelect,
	Selector,
	TextField,
} from "../../src";
import {EmailSenderField} from "../../src/Input/EmailSenderField";
import {Demo, DemoSource} from "../demo";
import {RadioGroupDemo} from "./RadioGroupDemo";
import {SelectDemo} from "./SelectDemo";
import {UrlUploadDemo} from "./UrlUploadDemo";

// @ts-ignore
import source from "./index.tsx?source";

export function Inputs() {
	return (
		<Container maxWidth="md">
			<PageTitle title="Inputs" gutterBottom />

			<Stack spacing={8}>
				<TextFieldDemo />
				<CheckboxDemo />
				<RadioGroupDemo />
				<SelectDemo />
				<UrlUploadDemo />

				<Box>
					<Typography variant="h2" gutterBottom>Selector</Typography>
					<Typography variant="body1" gutterBottom>
						Special case of Mui <Code>TextField</Code> that lets the user select from a list of options.
					</Typography>
					<SelectorDemo />
				</Box>

				<Box>
					<Typography variant="h2" gutterBottom>Action Menu</Typography>
					<Typography variant="body1" gutterBottom>
						Special case of Mui <Code>Button</Code> in combination with Mui <Code>Menu</Code>{" "}
						that lets the user click on a button or select from a list of options.
					</Typography>
					<ActionMenuDemo />
				</Box>

				<Box>
					<Typography variant="h2" gutterBottom>Number field</Typography>
					<Typography variant="body1" gutterBottom>
						Special case of Mui <Code>TextField</Code> that lets the user input a number in a certain
						<Code>Intl.NumberFormat</Code>.
					</Typography>
					<NumberFieldDemo />
				</Box>

				<Box sx={{mb: 4}}>
					<Typography variant="h2" gutterBottom>E-Mail fields</Typography>
					<Typography variant="body1" gutterBottom>
						Special case of Mui <Code>TextField</Code> that validates aspects around e-mail addresses.
					</Typography>
					<EmailFieldsDemo />
				</Box>

				<Box sx={{mb: 4}}>
					<Typography variant="h2" gutterBottom>Country & Locale selectors</Typography>
					<CountryLocaleSelectorDemo />
				</Box>
			</Stack>
		</Container>
	);
}

function TextFieldDemo(props: BoxProps) {
	const [text, setText] = useState("");
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => e.preventDefault();

	return (
		<Box {...props}>
			<Typography variant="h2" gutterBottom>
				<Code>TextField</Code>
			</Typography>
			<Typography variant="subtitle1" gutterBottom>
				Wraps a Mui <Code>TextField</Code> that provides the current value as the first argument to the{" "}
				<Code>onChange</Code> handler. The event is provided as the second argument.
			</Typography>
			<Typography variant="subtitle1" gutterBottom>
				It also displays errors from HTML5 form validation and allows for a custom <Code>validate</Code>{" "}
				function. Submit the form to trigger validation.
			</Typography>
			<Demo source={source} id="text-field">
				<form onSubmit={handleSubmit}>
					<Grid container spacing={2} p={2}>
						<Grid item xs={12} sm={6} md={4}>
							<DemoSource for="#text-field">
								<TextField
									label="Text field"
									value={text}
									onChange={setText}
									fullWidth
								/>
							</DemoSource>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<DemoSource for="#text-field">
								<TextField
									label="E-mail field"
									type="email"
									fullWidth
								/>
							</DemoSource>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<DemoSource for="#text-field">
								<TextField
									label="Required field"
									required
									fullWidth
								/>
							</DemoSource>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<DemoSource for="#text-field">
								<TextField
									label="Pattern field"
									required
									fullWidth
									inputProps={{
										pattern: "[a-z][0-9]+",
									}}
									helperText={"Enter one lowercase letter followed by one or more digits"}
								/>
							</DemoSource>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<DemoSource for="#text-field">
								<TextField
									label="Min/max length field"
									required
									fullWidth
									inputProps={{
										minLength: 3,
										maxLength: 7,
									}}
									helperText={"Enter from 3 to 7 chars."}
								/>
							</DemoSource>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<DemoSource for="#text-field">
								<TextField
									label="Custom validation"
									required
									fullWidth
									helperText="Please enter the value `foo`."
									validate={value => value != "foo" ? "You have to enter `foo`." : undefined}
								/>
							</DemoSource>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<DemoSource for="#text-field">
								<TextField
									label="Select"
									select
									required
									fullWidth
									helperText="Please choose an option"
									validate={value =>
										value != "option2" ? "You have to select `Option 2`." : undefined}
								>
									<MenuItem value="option1">Option 1</MenuItem>
									<MenuItem value="option2">Option 2</MenuItem>
									<MenuItem value="option3">Option 3</MenuItem>
								</TextField>
							</DemoSource>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<DemoSource for="#text-field">
								<TextField
									label="Multiline (min 20 chars)"
									required
									multiline
									fullWidth
									validate={value => value.length < 20 ? "Enter minimum 20 chars." : undefined}
								/>
							</DemoSource>
						</Grid>
					</Grid>
					<CardActions>
						<Button color="primary" type="submit">
							Submit
						</Button>
					</CardActions>
				</form>
			</Demo>
		</Box>
	);
}

function CheckboxDemo() {
	const [value, setValue] = useState(false);
	return (
		<Box>
			<Typography variant="h2" gutterBottom>
				<Code>Checkbox</Code>
			</Typography>
			<Typography variant="subtitle1" gutterBottom>
				Wraps a Mui <Code>Checkbox</Code> in a{" "}
				<Code>FormControlLabel</Code>. The checked value is passed as first argument to the{" "}
				<Code>onChange</Code> handler.
			</Typography>
			<Demo source={source} id="checkbox">
				<Box p={2}>
					<DemoSource for="#checkbox">
						<Checkbox label="Checkbox" value={value} onChange={setValue} />
					</DemoSource>
				</Box>
			</Demo>
		</Box>
	);
}

function SelectorDemo() {
	const [value, setValue] = useState("");
	return (
		<Card>
			<form onSubmit={e => e.preventDefault()}>
				<CardContent>
					<Stack spacing={2}>
						<Selector
							label="Color"
							value={value}
							onChange={setValue}
							options={[
								{label: "Green", value: "green"},
								{label: "Red", value: "red"},
								{label: "Blue", value: "blue"},
							]}
						/>
						<Selector
							label="Required color"
							required
							options={[
								{label: "Green", value: "green"},
								{label: "Red", value: "red"},
								{label: "Blue", value: "blue"},
							]}
						/>
						<Selector
							label="Validated color"
							required
							validate={value => value != "red" ? "You have to select `red`." : undefined}
							options={[
								{label: "Green", value: "green"},
								{label: "Red", value: "red"},
								{label: "Blue", value: "blue"},
							]}
						/>
					</Stack>
				</CardContent>
				<CardActions>
					<Button type="submit" color="primary">
						Submit
					</Button>
				</CardActions>
			</form>
		</Card>
	);
}

function ActionMenuDemo() {
	const actions: ActionMenuItem[] = [];

	function computeActions(): ActionMenuItem[] {
		const printAction: ActionMenuItem = {
			label: "Print",
			onClick: () => window.print(),
		};
		const checkedOption: ActionMenuItem = {
			label: "Mark Checked",
			onClick: () => console.log("Mark Checked"),
		};
		const triggerNextStateOption: ActionMenuItem = {
			label: "Trigger Next State",
			onClick: () => console.log("Trigger Next State"),
		};
		const deleteOption: ActionMenuItem = {
			label: "Delete",
			onClick: () => console.log("Delete"),
		};
		const manualHandoverOption: ActionMenuItem = {
			label: "Manual Handover",
			onClick: () => console.log("Manual Handover"),
		};

		actions.push(printAction, checkedOption, triggerNextStateOption, deleteOption, manualHandoverOption);

		return actions;
	}

	return (
		<Card>
			<CardContent>
				<ActionsMenu actions={computeActions()} />
			</CardContent>
		</Card>
	);
}

const DefaultNumberFormat = new Intl.NumberFormat();
const EnglishNumberFormat = new Intl.NumberFormat("en-US");
const GermanNumberFormat = new Intl.NumberFormat("de-DE");

function NumberFieldDemo() {
	const [value, setValue] = useState<number | null>(1234.99);

	return (
		<Card>
			<CardHeader title="Number field" />
			<CardContent>
				<Grid container spacing={2}>
					<Grid item>
						<NumberField
							label="Browser default format"
							numberFormat={DefaultNumberFormat}
							numberValue={value}
							onChangeNumber={setValue}
						/>
					</Grid>
					<Grid item>
						<NumberField
							label="English format"
							numberFormat={EnglishNumberFormat}
							numberValue={value}
							onChangeNumber={setValue}
						/>
					</Grid>
					<Grid item>
						<NumberField
							label="German format"
							numberFormat={GermanNumberFormat}
							numberValue={value}
							onChangeNumber={setValue}
						/>
					</Grid>
					<Grid item>
						<NumberField
							label="Integer format"
							numberFormat={IntegerNumberFormat}
							numberValue={value}
							onChangeNumber={setValue}
						/>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
}

function EmailFieldsDemo() {
	const [email, setEmail] = useState("");
	const [validSender, setValidSender] = useState(false);

	return (
		<Card>
			<CardHeader title="E-Mail fields" />
			<CardContent>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={8}>
						<EmailSenderField value={email} onChange={setEmail} updateValidity={setValidSender} fullWidth />
					</Grid>
					{!validSender
						&& (
							<Grid item xs={12} sm={4}>
								<Alert severity="error">
									The e-mail address you entered is not a valid sender e-mail address.
								</Alert>
							</Grid>
						)}
				</Grid>
			</CardContent>
		</Card>
	);
}

function CountryLocaleSelectorDemo() {
	const [country, setCountry] = useState<string>();
	const [prefix, setPrefix] = useState<string>();
	const [locale, setLocale] = useState<string>();

	return (
		<Card>
			<CardHeader title="Country selector" />
			<CardContent>
				<CountrySelect
					label="Select country"
					value={country ?? ""}
					onChange={v => setCountry(v ?? undefined)}
				/>
			</CardContent>
			<CardHeader title="Locale selector" />
			<CardContent>
				<LocaleSelect
					label="Select locale"
					value={locale}
					onChange={setLocale}
				/>
			</CardContent>
			<CardHeader title="Phone prefix selector" />
			<CardContent>
				<PhonePrefixSelect
					label="Select phone prefix"
					value={prefix ?? ""}
					onChange={v => setPrefix(v ?? undefined)}
				/>
			</CardContent>
		</Card>
	);
}
