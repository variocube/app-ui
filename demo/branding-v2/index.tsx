import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Checkbox,
	Container,
	FormControlLabel,
	MenuItem,
	PaletteMode,
	Slider,
	Stack,
	Switch,
	TextField,
	ThemeProvider,
	Typography,
} from "@mui/material";
import React, {useMemo, useState} from "react";
import {
	BRANDING_V2_ANCHORS,
	BrandingV2,
	BrandingV2Anchor,
	brandingV2BackgroundPosition,
	BrandingV2Mode,
	Code,
	createBrandingV2Theme,
	getBrandingV2Modes,
	PageTitle,
	ThemeModeSwitcher,
	VCLogo,
} from "../../src";
import {useSetBrandingV2} from "../branding";
import {Demo, DemoControls, DemoSource} from "../demo";

// @ts-ignore
import source from "./index.tsx?source";

const EXAMPLE_LIGHT: BrandingV2Mode = {
	primary: "#00507a",
	secondary: "#b3261e",
	background: "#e8eef2",
	surface: "#ffffffcc",
	logoUrl: null,
};

const EXAMPLE_DARK: BrandingV2Mode = {
	primary: "#7cc4f0",
	secondary: "#ffb4a9",
	background: "#0d1a22",
	surface: "#1b2a33cc",
	logoUrl: null,
};

const EXAMPLE: BrandingV2 = {
	borderRadius: 12,
	shadows: false,
	outlines: true,
	defaultMode: "light",
	light: EXAMPLE_LIGHT,
	dark: EXAMPLE_DARK,
	backgroundImage: null,
};

export function BrandingV2Demo() {
	const [branding, setBranding] = useState<BrandingV2>(EXAMPLE);
	const setAppBrandingV2 = useSetBrandingV2();
	const modes = getBrandingV2Modes(branding);

	function update(patch: Partial<BrandingV2>) {
		setBranding(previous => ({...previous, ...patch}));
	}

	return (
		<Container maxWidth="lg">
			<PageTitle title="Branding v2" gutterBottom />
			<Typography variant="body1" gutterBottom>
				Pass a <Code>BrandingV2</Code> to <Code>VCThemeProvider</Code> as{" "}
				<Code>brandingV2</Code>, or build the theme of one mode with{" "}
				<Code>createBrandingV2Theme(branding, mode)</Code> and nest it with a plain MUI{" "}
				<Code>ThemeProvider</Code>, as the previews below do.
			</Typography>

			<Stack spacing={2} sx={{mb: 2}}>
				<Card>
					<CardHeader title="Branding" />
					<CardContent>
						<BrandingV2Form branding={branding} onChange={update} />
					</CardContent>
				</Card>

				<Demo id="preview" source={source}>
					<CardHeader title="Preview of each mode" />
					<CardContent>
						<Stack direction={{xs: "column", md: "row"}} spacing={2}>
							{modes.map(mode => <BrandingV2Preview key={mode} branding={branding} mode={mode} />)}
						</Stack>
					</CardContent>
					<DemoControls>
						<Stack direction="row" spacing={2} alignItems="center">
							<Button variant="contained" onClick={() => setAppBrandingV2(branding)}>
								Apply to this app
							</Button>
							<Button variant="outlined" onClick={() => setAppBrandingV2(undefined)}>
								Back to the Variocube look
							</Button>
							<ThemeModeSwitcher />
						</Stack>
					</DemoControls>
				</Demo>
			</Stack>
		</Container>
	);
}

interface BrandingV2PreviewProps {
	branding: BrandingV2;
	mode: PaletteMode;
}

function BrandingV2Preview({branding, mode}: Readonly<BrandingV2PreviewProps>) {
	const theme = useMemo(() => createBrandingV2Theme(branding, mode), [branding, mode]);
	const image = branding.backgroundImage;
	const logoUrl = branding[mode]?.logoUrl;
	return (
		<DemoSource for="#preview">
			<ThemeProvider theme={theme}>
				<Box
					sx={{
						flex: 1,
						p: 2,
						color: "text.primary",
						bgcolor: "background.default",
						backgroundImage: image ? `url(${JSON.stringify(image.url)})` : undefined,
						backgroundSize: "cover",
						backgroundPosition: brandingV2BackgroundPosition(image?.anchor),
					}}
				>
					{logoUrl ? <img src={logoUrl} height={40} alt="" /> : <VCLogo height={40} width="auto" />}
					<Card sx={{mt: 2}}>
						<CardHeader title={`${mode} mode`} subheader="A card on the surface" />
						<CardContent>
							<Stack direction="row" spacing={1} sx={{mb: 2}}>
								<Button variant="contained">Primary</Button>
								<Button variant="contained" color="secondary">Secondary</Button>
								<Button variant="outlined">Outlined</Button>
							</Stack>
							<Card>
								<CardContent>
									<Typography variant="h6">A tile on the card</Typography>
									<TextField label="A field" size="small" sx={{mt: 1}} />
								</CardContent>
							</Card>
						</CardContent>
					</Card>
				</Box>
			</ThemeProvider>
		</DemoSource>
	);
}

interface BrandingV2FormProps {
	branding: BrandingV2;
	onChange: (patch: Partial<BrandingV2>) => void;
}

function BrandingV2Form({branding, onChange}: Readonly<BrandingV2FormProps>) {
	const {borderRadius, shadows, outlines, defaultMode, backgroundImage} = branding;
	return (
		<Stack spacing={2}>
			<Box>
				<Typography gutterBottom>Border radius: {borderRadius}px</Typography>
				<Slider
					min={0}
					max={24}
					value={borderRadius}
					onChange={(_event, value) => onChange({borderRadius: value as number})}
				/>
			</Box>
			<Stack direction="row" spacing={2}>
				<FormControlLabel
					control={<Switch checked={shadows} onChange={(_e, checked) => onChange({shadows: checked})} />}
					label="Shadows"
				/>
				<FormControlLabel
					control={<Switch checked={outlines} onChange={(_e, checked) => onChange({outlines: checked})} />}
					label="Outlines"
				/>
				<TextField
					select
					label="Default mode"
					size="small"
					value={defaultMode}
					onChange={e => onChange({defaultMode: e.target.value as PaletteMode})}
				>
					<MenuItem value="light">light</MenuItem>
					<MenuItem value="dark">dark</MenuItem>
				</TextField>
			</Stack>
			<Stack direction={{xs: "column", md: "row"}} spacing={2}>
				<ModeForm
					mode="light"
					value={branding.light}
					example={EXAMPLE_LIGHT}
					onChange={light => onChange({light})}
				/>
				<ModeForm
					mode="dark"
					value={branding.dark}
					example={EXAMPLE_DARK}
					onChange={dark => onChange({dark})}
				/>
			</Stack>
			<Stack direction="row" spacing={2}>
				<TextField
					label="Background image URL"
					size="small"
					fullWidth
					value={backgroundImage?.url ?? ""}
					onChange={e =>
						onChange({
							backgroundImage: e.target.value
								? {url: e.target.value, anchor: backgroundImage?.anchor ?? "center"}
								: null,
						})}
				/>
				<TextField
					select
					label="Anchor"
					size="small"
					sx={{minWidth: 160}}
					disabled={!backgroundImage}
					value={backgroundImage?.anchor ?? "center"}
					onChange={e =>
						backgroundImage
						&& onChange({
							backgroundImage: {...backgroundImage, anchor: e.target.value as BrandingV2Anchor},
						})}
				>
					{BRANDING_V2_ANCHORS.map(anchor => <MenuItem key={anchor} value={anchor}>{anchor}</MenuItem>)}
				</TextField>
			</Stack>
		</Stack>
	);
}

interface ModeFormProps {
	mode: PaletteMode;
	value: BrandingV2Mode | null;
	example: BrandingV2Mode;
	onChange: (value: BrandingV2Mode | null) => void;
}

const COLOUR_FIELDS = ["primary", "secondary", "background", "surface"] as const;

function ModeForm({mode, value, example, onChange}: Readonly<ModeFormProps>) {
	return (
		<Stack spacing={1} sx={{flex: 1}}>
			<FormControlLabel
				control={
					<Checkbox
						checked={value != null}
						onChange={(_e, checked) => onChange(checked ? example : null)}
					/>
				}
				label={`${mode} mode`}
			/>
			{value && COLOUR_FIELDS.map(field => (
				<TextField
					key={field}
					label={field == "surface" ? "surface (#rrggbb or #rrggbbaa)" : field}
					size="small"
					value={value[field]}
					onChange={e => onChange({...value, [field]: e.target.value})}
				/>
			))}
			{value && (
				<TextField
					label="Logo URL"
					size="small"
					value={value.logoUrl ?? ""}
					onChange={e => onChange({...value, logoUrl: e.target.value || null})}
				/>
			)}
		</Stack>
	);
}
