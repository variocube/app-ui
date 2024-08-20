import {
	Box,
	BoxProps,
	Card,
	CardContent,
	CardHeader,
	Container,
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import * as React from "react";
import {useCallback, useState} from "react";
import {
	Code,
	CompactFormat,
	createLocalizationContext,
	CurrencyFormat,
	DecimalFormat,
	Now,
	PageTitle,
	RelativeTemporalFormat,
	RelativeTemporalFormatProps,
	TemporalFormat,
	TemporalRangeFormat,
} from "../../src";
import {SwitchableTemporalFormat} from "../../src/formats/SwitchableTemporalFormat";
import {DateStyle, TimeStyle} from "../../src/formats/types";
import {Demo, DemoControls, DemoSource} from "../demo";

// @ts-ignore
import source from "./index.tsx?source";

const {StorageLocalizationProvider, useLocalization} = createLocalizationContext<typeof import("./en.json")>({
	load: language => import(`./${language}.json`),
	fallback: "en",
});

export function Localization() {
	const overrides = {
		de: {
			overriddenInDe: "Ich bin der Kunde und ich will es anders.",
		},
	};

	return (
		<Container>
			<PageTitle title="Localization" gutterBottom />

			<Stack spacing={8}>
				<Box>
					<Typography variant="h2" gutterBottom>Translations</Typography>

					<StorageLocalizationProvider overrides={overrides}>
						<TranslationDemo />
					</StorageLocalizationProvider>
				</Box>
				<Box>
					<Typography variant="h2" gutterBottom>Translations Has Key</Typography>

					<StorageLocalizationProvider overrides={overrides}>
						<TranslationHasKeyDemo />
					</StorageLocalizationProvider>
				</Box>
				<Box>
					<Typography variant="h2" gutterBottom>Number formats</Typography>
					<Typography variant="body1" gutterBottom>
						Display numbers according to the user's locale settings.
					</Typography>

					<NumberDemo />
				</Box>
				<Box>
					<Typography variant="h2" gutterBottom>Date & time formats</Typography>
					<Typography variant="body1" gutterBottom>
						Display dates & times according to the user's locale settings.
					</Typography>
				</Box>
				<TemporalFormatDemo />
				<RelativeTemporalFormatDemo />
				<SwitchableTemporalFormatDemo />
				<TemporalRangeFormatDemo />
			</Stack>
		</Container>
	);
}

export function TranslationDemo() {
	const {t, e, s, language, setLanguage} = useLocalization();

	const handleLanguageChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => setLanguage(e.currentTarget.value),
		[],
	);

	return (
		<Card>
			<CardHeader title="Example" />
			<CardContent>
				<RadioGroup row value={language} onChange={handleLanguageChange}>
					<FormControlLabel value="en" control={<Radio />} label="English" />
					<FormControlLabel value="de" control={<Radio />} label="Deutsch" />
				</RadioGroup>
			</CardContent>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell sx={{width: "50%"}}>Code</TableCell>
						<TableCell>Output</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCell>
							<Code>t("nested.foo")</Code>
						</TableCell>
						<TableCell>{t("nested.foo")}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>
							<Code>t("greeting", {"{"}name: "John"{"}"})</Code>
						</TableCell>
						<TableCell>{t("greeting", {name: "John"})}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>
							<Code>e("state", "pending")</Code>
						</TableCell>
						<TableCell>{e("state", "pending")}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>
							<Code>s("state")("pending")</Code>
						</TableCell>
						<TableCell>{s("state")("pending")}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>
							<Code>t("overriddenInDe")</Code>
						</TableCell>
						<TableCell>{t("overriddenInDe")}</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Card>
	);
}

export function TranslationHasKeyDemo() {
	const {hasKey} = useLocalization();

	return (
		<Card>
			<CardHeader title="Example" />
			<Table>
				<TableHead>
					<TableRow>
						<TableCell sx={{width: "50%"}}>Code</TableCell>
						<TableCell>Output</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCell>
							<Code>hasKey("nested.foo") ? "Has Key" : "Has not Key"</Code>
						</TableCell>
						<TableCell>{hasKey("nested.foo") ? "Has Key" : "Has not Key"}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>
							<Code>hasKey("nested.doesnotexist") ? "Has Key" : "Has not Key"</Code>
						</TableCell>
						<TableCell>{hasKey("nested.doesnotexist") ? "Has Key" : "Has not Key"}</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Card>
	);
}

function NumberDemo() {
	return (
		<Stack spacing={2} direction="row">
			<Card>
				<CardHeader title="CurrencyFormat" />
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Amount</TableCell>
							<TableCell>Currency</TableCell>
							<TableCell>Result</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell>1234.5</TableCell>
							<TableCell>USD</TableCell>
							<TableCell>
								<CurrencyFormat value={1234.5} currency="USD" />
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>5432.1</TableCell>
							<TableCell>EUR</TableCell>
							<TableCell>
								<CurrencyFormat value={5432.1} currency="EUR" />
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>1000</TableCell>
							<TableCell>GBP</TableCell>
							<TableCell>
								<CurrencyFormat value={1000} currency="GBP" />
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</Card>

			<Card>
				<CardHeader title="DecimalFormat" />
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Number</TableCell>
							<TableCell>Fraction digits</TableCell>
							<TableCell>Result</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell>2929</TableCell>
							<TableCell>not specified</TableCell>
							<TableCell>
								<DecimalFormat value={2929} />
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>234.3333</TableCell>
							<TableCell>2</TableCell>
							<TableCell>
								<DecimalFormat value={234.3333} fractionDigits={2} />
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>2929</TableCell>
							<TableCell>2</TableCell>
							<TableCell>
								<DecimalFormat value={2929} fractionDigits={2} />
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</Card>

			<Card>
				<CardHeader title="CompactFormat" />
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Number</TableCell>
							<TableCell>Display</TableCell>
							<TableCell>Result</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell>1234567890</TableCell>
							<TableCell>not specified</TableCell>
							<TableCell>
								<CompactFormat value={1234567890} />
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>100000</TableCell>
							<TableCell>short</TableCell>
							<TableCell>
								<CompactFormat value={100000} compactDisplay="short" />
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>1000.1</TableCell>
							<TableCell>long</TableCell>
							<TableCell>
								<CompactFormat value={1000.1} compactDisplay="long" />
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</Card>
		</Stack>
	);
}

function TemporalFormatDemo(props: BoxProps) {
	const [dateStyle, setDateStyle] = useState<DateStyle>();
	const [timeStyle, setTimeStyle] = useState<TimeStyle>();

	return (
		<Box {...props}>
			<Typography variant="h2" gutterBottom>
				<Code>TemporalFormat</Code>
			</Typography>
			<Typography variant="subtitle1" gutterBottom>
				Displays a <Code>Temporal</Code>.
			</Typography>

			<Demo source={source} id="temporal-format">
				<DemoSource>
					<Stack spacing={2} direction="row">
						<Box>
							<TemporalFormat
								value={Now.instant()}
								dateStyle={dateStyle}
								timeStyle={timeStyle}
							/>
						</Box>
						<Box>
							<TemporalFormat
								value={Now.plainDateTimeISO().subtract({days: 2})}
								dateStyle={dateStyle}
								timeStyle={timeStyle}
							/>
						</Box>
						<Box>
							<TemporalFormat
								value={Now.plainDateISO().subtract({years: 4})}
								dateStyle={dateStyle}
								timeStyle={timeStyle}
							/>
						</Box>
					</Stack>
				</DemoSource>
				<DemoControls>
					<DateStyleControl value={dateStyle} onChange={setDateStyle} />
					<TimeStyleControl value={timeStyle} onChange={setTimeStyle} />
				</DemoControls>
			</Demo>
		</Box>
	);
}

function RelativeTemporalFormatDemo(props: BoxProps) {
	const [numeric, setNumeric] = useState<RelativeTemporalFormatProps["numeric"]>();
	const [style, setStyle] = useState<RelativeTemporalFormatProps["style"]>();

	return (
		<Box {...props}>
			<Typography variant="h2" gutterBottom>
				<Code>RelativeTemporalFormat</Code>
			</Typography>
			<Typography variant="subtitle1" gutterBottom>
				Displays a <Code>Temporal</Code> relative to the current instant in time.
			</Typography>

			<Demo source={source} id="temporal-format">
				<DemoSource>
					<Stack spacing={2} direction="row">
						<Box>
							<RelativeTemporalFormat
								value={Now.instant()}
								numeric={numeric}
								style={style}
							/>
						</Box>
						<Box>
							<RelativeTemporalFormat
								value={Now.plainDateTimeISO().subtract({minutes: 1, seconds: 10})}
								numeric={numeric}
								style={style}
							/>
						</Box>
						<Box>
							<RelativeTemporalFormat
								value={Now.plainDateTimeISO().subtract({days: 2})}
								numeric={numeric}
								style={style}
							/>
						</Box>
						<Box>
							<RelativeTemporalFormat
								value={Now.plainDateISO().subtract({years: 4})}
								numeric={numeric}
								style={style}
							/>
						</Box>
					</Stack>
				</DemoSource>
				<DemoControls>
					<StyleControl value={style} onChange={setStyle} />
					<NumericControl value={numeric} onChange={setNumeric} />
				</DemoControls>
			</Demo>
		</Box>
	);
}

function TemporalRangeFormatDemo(props: BoxProps) {
	const [dateStyle, setDateStyle] = useState<DateStyle>();
	const [timeStyle, setTimeStyle] = useState<TimeStyle>();

	return (
		<Box {...props}>
			<Typography variant="h2" gutterBottom>
				<Code>TemporalRangeFormat</Code>
			</Typography>
			<Typography variant="subtitle1" gutterBottom>
				Displays a <Code>Temporal</Code> range.
			</Typography>

			<Demo source={source} id="temporal-range-format">
				<DemoSource>
					<Stack spacing={2} direction="row">
						<Box>
							<TemporalRangeFormat
								from={Now.instant()}
								until={Now.instant().add({hours: 2})}
								dateStyle={dateStyle}
								timeStyle={timeStyle}
							/>
						</Box>
						<Box>
							<TemporalRangeFormat
								from={Now.plainDateTimeISO().subtract({days: 2})}
								until={Now.plainDateTimeISO().subtract({days: 1})}
								dateStyle={dateStyle}
								timeStyle={timeStyle}
							/>
						</Box>
						<Box>
							<TemporalRangeFormat
								from={Now.plainDateISO().subtract({years: 4})}
								until={Now.plainDateISO().subtract({years: 2})}
								dateStyle={dateStyle}
								timeStyle={timeStyle}
							/>
						</Box>
					</Stack>
				</DemoSource>
				<DemoControls>
					<DateStyleControl value={dateStyle} onChange={setDateStyle} />
					<TimeStyleControl value={timeStyle} onChange={setTimeStyle} />
				</DemoControls>
			</Demo>
		</Box>
	);
}

function SwitchableTemporalFormatDemo(props: BoxProps) {
	return (
		<Box {...props}>
			<Typography variant="h2" gutterBottom>
				<Code>SwitchableTemporalFormat</Code>
			</Typography>
			<Typography variant="subtitle1" gutterBottom>
				Displays a <Code>Temporal</Code>{" "}
				either in relative or absolute format. Allows to switch formats by clicking on the value.
			</Typography>

			<Demo source={source} id="switchable-temporal-format">
				<DemoSource>
					<Stack spacing={2} direction="row">
						<SwitchableTemporalFormat
							value={Now.instant()}
						/>
						<SwitchableTemporalFormat
							value={Now.instant().subtract({hours: 3, minutes: 55})}
						/>
						<SwitchableTemporalFormat
							value={Now.plainDateISO().add({years: 2, months: 4})}
						/>
					</Stack>
				</DemoSource>
			</Demo>
		</Box>
	);
}

interface DateStyleControlProps {
	value: DateStyle | undefined;
	onChange: (dateStyle: DateStyle | undefined) => any;
}

function DateStyleControl({value, onChange}: DateStyleControlProps) {
	return (
		<FormControl>
			<FormLabel>dateStyle</FormLabel>
			<RadioGroup
				value={value || ""}
				onChange={(_, value) => onChange(value as DateStyle || undefined)}
			>
				<FormControlLabel control={<Radio value="" />} label="undefined" />
				<FormControlLabel control={<Radio value="full" />} label="full" />
				<FormControlLabel control={<Radio value="long" />} label="long" />
				<FormControlLabel control={<Radio value="medium" />} label="medium" />
				<FormControlLabel control={<Radio value="short" />} label="short" />
			</RadioGroup>
		</FormControl>
	);
}

interface TimeStyleControlProps {
	value: TimeStyle | undefined;
	onChange: (timeStyle: TimeStyle | undefined) => any;
}

function TimeStyleControl({value, onChange}: TimeStyleControlProps) {
	return (
		<FormControl>
			<FormLabel>timeStyle</FormLabel>
			<RadioGroup
				value={value || ""}
				onChange={(_, value) => onChange(value as TimeStyle || undefined)}
			>
				<FormControlLabel control={<Radio value="" />} label="undefined" />
				<FormControlLabel control={<Radio value="full" />} label="full" />
				<FormControlLabel control={<Radio value="long" />} label="long" />
				<FormControlLabel control={<Radio value="medium" />} label="medium" />
				<FormControlLabel control={<Radio value="short" />} label="short" />
			</RadioGroup>
		</FormControl>
	);
}

interface StyleControlProps {
	value: RelativeTemporalFormatProps["style"] | undefined;
	onChange: (numeric: RelativeTemporalFormatProps["style"] | undefined) => any;
}

function StyleControl({value, onChange}: StyleControlProps) {
	return (
		<FormControl>
			<FormLabel>style</FormLabel>
			<RadioGroup
				value={value || ""}
				onChange={(_, value) => onChange(value as RelativeTemporalFormatProps["style"] || undefined)}
			>
				<FormControlLabel control={<Radio value="" />} label="undefined" />
				<FormControlLabel control={<Radio value="long" />} label="long" />
				<FormControlLabel control={<Radio value="short" />} label="short" />
				<FormControlLabel control={<Radio value="narrow" />} label="narrow" />
			</RadioGroup>
		</FormControl>
	);
}

interface NumericControlProps {
	value: RelativeTemporalFormatProps["numeric"] | undefined;
	onChange: (numeric: RelativeTemporalFormatProps["numeric"] | undefined) => any;
}

function NumericControl({value, onChange}: NumericControlProps) {
	return (
		<FormControl>
			<FormLabel>numeric</FormLabel>
			<RadioGroup
				value={value || ""}
				onChange={(_, value) => onChange(value as RelativeTemporalFormatProps["numeric"] || undefined)}
			>
				<FormControlLabel control={<Radio value="" />} label="undefined" />
				<FormControlLabel control={<Radio value="always" />} label="always" />
				<FormControlLabel control={<Radio value="auto" />} label="auto" />
			</RadioGroup>
		</FormControl>
	);
}
