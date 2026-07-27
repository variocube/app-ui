import {Box, Stack, Typography} from "@mui/material";
import React, {useState} from "react";
import {Code, Duration, DurationField, DurationFormat} from "../../src";
import {Demo, DemoSource} from "../demo";

// @ts-ignore
import source from "./DurationFieldDemo.tsx?source";

export function DurationFieldDemo() {
	const [duration, setDuration] = useState<Duration | null>(null);
	const [retention, setRetention] = useState<Duration | null>(Duration.from({years: 7}));

	return (
		<Box>
			<Typography variant="h2" gutterBottom>
				<Code>DurationField</Code>
			</Typography>
			<Typography variant="subtitle1" gutterBottom>
				Edits a nullable <Code>Temporal.Duration</Code>{" "}
				as a sequence of number+unit pairs. After the last entered pair, an empty pair with the next smaller
				unit allows adding another component. Units are never converted: 365 days stay 365 days. The available
				units can be constrained with the <Code>units</Code>{" "}
				property, e.g. to date-based units for values that map to a <Code>java.time.Period</Code>{" "}
				on the backend. The value is rendered below the fields with <Code>DurationFormat</Code>, which uses{" "}
				<Code>Intl.DurationFormat</Code> where available.
			</Typography>
			<Demo source={source} id="duration-field">
				<Stack spacing={2} p={2}>
					<DemoSource for="#duration-field">
						<DurationField
							label="Duration"
							value={duration}
							onChange={setDuration}
							fullWidth
						/>
						<DurationField
							label="Retention period"
							helperText="Only date-based units, round-trips to a java.time.Period"
							value={retention}
							onChange={setRetention}
							units={["years", "months", "weeks", "days"]}
							fullWidth
						/>
					</DemoSource>
					<Typography variant="body2">
						Duration: <Code>{duration?.toString() ?? "null"}</Code>
						{duration && (
							<>
								{" — "}
								<DurationFormat value={duration} style="long" />
							</>
						)}
					</Typography>
					<Typography variant="body2">
						Retention period: <Code>{retention?.toString() ?? "null"}</Code>
						{retention && (
							<>
								{" — "}
								<DurationFormat value={retention} style="long" />
							</>
						)}
					</Typography>
				</Stack>
			</Demo>
		</Box>
	);
}
