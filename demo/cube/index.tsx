import {Autocomplete, Box, BoxProps, Container, Slider, Stack, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import {
	BoxFeatures,
	BoxMaintenanceChip,
	BoxNumber,
	BoxTypes,
	Code,
	createLocalizationContext,
	CubeConnectedChip,
	LanguageSwitcher,
	LockStatusChip,
	Now,
	Switch,
	UtilizationBar,
} from "../../src";

import {Demo, DemoControls, DemoSource} from "../demo";

// @ts-ignore
import source from "./index.tsx?source";

const i18n = {
	en: {
		cube: {
			connected: "Connected",
			disconnected: "Disconnected",
		},
		box: {
			features: {
				accessible: "Accessible",
				charger: "Charger",
				cooled: "Cooled",
				dangerousGoods: "Dangerous Goods",
				none: "None",
			},
			maintenanceRequired: "Maintenance required",
		},
		lock: {
			status: {
				open: "Open",
				closed: "Closed",
				blocked: "Blocked",
				breakin: "Break-In",
			},
		},
		utilization: {
			available: "Available",
			occupied: "Occupied",
			disabled: "Disabled",
			total: "Total",
		},
	},
	de: {
		cube: {
			connected: "Verbunden",
			disconnected: "Nicht verbunden",
		},
		box: {
			features: {
				accessible: "Behindertengerecht",
				charger: "Ladegerät",
				cooled: "Gekühlt",
				dangerousGoods: "Gefahrengut",
				none: "Keine",
			},
			maintenanceRequired: "Wartung erforderlich",
		},
		lock: {
			status: {
				open: "Offen",
				closed: "Geschlossen",
				blocked: "Blockiert",
				breakin: "Einbruch",
			},
		},
		utilization: {
			available: "Verfügbar",
			occupied: "Belegt",
			disabled: "Deaktiviert",
			total: "Gesamt",
		},
	},
};

const {StorageLocalizationProvider, useLocalization} = createLocalizationContext<typeof i18n.en>({
	load: language => {
		const messages = i18n[language as "en" | "de"];
		return messages ? Promise.resolve(messages) : Promise.reject("Unsupported language");
	},
	fallback: "en",
});

function CubeDemoLanguageSwitcher() {
	const {language, setLanguage} = useLocalization();

	return (
		<LanguageSwitcher
			language={language}
			setLanguage={setLanguage}
			languages={[
				{language: "en", displayName: "English"},
				{language: "de", displayName: "Deutsch"},
			]}
		/>
	);
}

function BoxFeaturesDemo(props: BoxProps) {
	const {s} = useLocalization();
	const [minimized, setMinimized] = useState(false);
	const [cooled, setCooled] = useState(true);
	const [accessible, setAccessible] = useState(true);
	const [dangerousGoods, setDangerousGoods] = useState(true);
	const [charger, setCharger] = useState(true);
	return (
		<Box {...props}>
			<Typography variant="h2" gutterBottom>
				<Code>BoxFeatures</Code>
			</Typography>
			<Typography variant="subtitle1" gutterBottom>Displays features of a box.</Typography>

			<Demo source={source} id="box-features">
				<DemoSource>
					<BoxFeatures
						cooled={cooled}
						accessible={accessible}
						dangerousGoods={dangerousGoods}
						charger={charger}
						minimized={minimized}
						labels={s("box.features")}
					/>
				</DemoSource>
				<DemoControls>
					<Switch value={cooled} onChange={setCooled} label="Cooled" />
					<Switch value={accessible} onChange={setAccessible} label="Accessible" />
					<Switch value={dangerousGoods} onChange={setDangerousGoods} label="Dangerous Goods" />
					<Switch value={charger} onChange={setCharger} label="Charger" />
					<Switch value={minimized} onChange={setMinimized} label="Minimized" />
				</DemoControls>
			</Demo>
		</Box>
	);
}

export function CubeConnectedChipDemo(props: BoxProps) {
	const {s} = useLocalization();
	const [connected, setConnected] = useState(true);
	return (
		<Box {...props}>
			<Typography variant="h2" gutterBottom>
				<Code>CubeConnectedChip</Code>
			</Typography>
			<Typography variant="subtitle1" gutterBottom>
				Displays the cube connection status.
			</Typography>

			<Demo source={source} id="cube-connected-chip">
				<DemoSource>
					<Stack direction="row" spacing={1}>
						<CubeConnectedChip
							labels={s("cube")}
							connected={connected}
						/>
						<CubeConnectedChip
							variant="outlined"
							labels={s("cube")}
							connected={connected}
						/>
					</Stack>
				</DemoSource>
				<DemoControls>
					<Switch value={connected} onChange={setConnected} label="Connected" />
				</DemoControls>
			</Demo>
		</Box>
	);
}

function UtilizationBarDemo(props: BoxProps) {
	const {s} = useLocalization();
	return (
		<Box {...props}>
			<Typography variant="h2" gutterBottom>
				<Code>UtilizationBar</Code>
			</Typography>
			<Typography variant="subtitle1" gutterBottom>Displays the utilization of a cube.</Typography>
			<Demo id="utilization-bar" source={source}>
				<DemoSource>
					<UtilizationBar
						occupied={15}
						available={32}
						disabled={8}
						total={55}
						labels={s("utilization")}
					/>
				</DemoSource>
			</Demo>
		</Box>
	);
}

function LockStatusChipDemo(props: BoxProps) {
	const {s} = useLocalization();
	const labels = s("lock.status");
	const [minimized, setMinimized] = useState(false);

	return (
		<Box {...props}>
			<Typography variant="h2" gutterBottom>
				<Code>LockStatusChip</Code>
			</Typography>
			<Typography variant="subtitle1" gutterBottom>Displays a lock status.</Typography>
			<Demo id="lock-status-chip" source={source}>
				<DemoSource>
					<Stack direction="row" spacing={1}>
						<LockStatusChip labels={labels} status="Open" minimized={minimized} />
						<LockStatusChip labels={labels} status="Closed" minimized={minimized} />
						<LockStatusChip labels={labels} status="Blocked" minimized={minimized} />
						<LockStatusChip labels={labels} status="Breakin" minimized={minimized} />
					</Stack>
				</DemoSource>
				<DemoControls>
					<Switch value={minimized} onChange={setMinimized} label="Minimized" />
				</DemoControls>
			</Demo>
		</Box>
	);
}

function BoxNumberDemo(props: BoxProps) {
	const [boxNumber, setBoxNumber] = useState(1);
	return (
		<Box {...props}>
			<Typography variant="h2" gutterBottom>
				<Code>BoxNumber</Code>
			</Typography>
			<Typography variant="subtitle1" gutterBottom>Displays a box number.</Typography>
			<Demo id="box-number" source={source}>
				<DemoSource>
					<BoxNumber number={boxNumber} />
				</DemoSource>
				<DemoControls>
					<Slider
						value={boxNumber}
						min={1}
						max={999}
						onChange={(_, value) => setBoxNumber(value as number)}
					/>
				</DemoControls>
			</Demo>
		</Box>
	);
}

function BoxTypesDemo(props: BoxProps) {
	const [boxTypes, setBoxTypes] = useState(["M", "L"]);
	return (
		<Box {...props}>
			<Typography variant="h2" gutterBottom>
				<Code>BoxTypes</Code>
			</Typography>
			<Typography variant="subtitle1" gutterBottom>Displays the types of a box.</Typography>
			<Demo id="box-types" source={source}>
				<DemoSource>
					<BoxTypes boxTypes={boxTypes} />
				</DemoSource>
				<DemoControls>
					<Autocomplete
						value={boxTypes}
						multiple
						options={["XS", "S", "M", "L", "XL", "PrivateBox"]}
						onChange={(e, value) => setBoxTypes(value as string[])}
						renderInput={params => (
							<TextField
								{...params}
								variant="outlined"
								label="Box types"
							/>
						)}
					/>
				</DemoControls>
			</Demo>
		</Box>
	);
}

function BoxMaintenanceChipDemo(props: BoxProps) {
	const {s} = useLocalization();
	const [maintenanceRequiredAt, setMaintenanceRequiredAt] = useState<string | undefined>(Now.instant().toString());
	const [minimized, setMinimized] = useState(false);

	return (
		<Box {...props}>
			<Typography variant="h2" gutterBottom>
				<Code>BoxMaintenanceChip</Code>
			</Typography>
			<Typography variant="subtitle1" gutterBottom>Displays the maintenance status of a box.</Typography>
			<Demo id="box-maintenance-chip" source={source}>
				<DemoSource>
					<BoxMaintenanceChip
						maintenanceRequiredAt={maintenanceRequiredAt}
						minimized={minimized}
						labels={s("box")}
					/>
				</DemoSource>
				<DemoControls>
					<Switch
						label="Maintenance required"
						value={Boolean(maintenanceRequiredAt)}
						onChange={(checked) => setMaintenanceRequiredAt(checked ? Now.instant().toString() : undefined)}
					/>
					<Switch value={minimized} onChange={setMinimized} label="Minimized" />
				</DemoControls>
			</Demo>
		</Box>
	);
}

export function CubeDemo() {
	return (
		<StorageLocalizationProvider>
			<Container>
				<Stack direction="row" spacing={2} alignItems="center">
					<Typography variant="h1" gutterBottom>Cube Demo</Typography>
					<CubeDemoLanguageSwitcher />
				</Stack>

				<Box sx={{mb: 4}}>
					<Typography>Collection of cube components.</Typography>
				</Box>

				<Stack direction="column" spacing={8}>
					<CubeConnectedChipDemo />
					<UtilizationBarDemo />
					<LockStatusChipDemo />
					<BoxFeaturesDemo />
					<BoxNumberDemo />
					<BoxTypesDemo />
					<BoxMaintenanceChipDemo />
				</Stack>
			</Container>
		</StorageLocalizationProvider>
	);
}
