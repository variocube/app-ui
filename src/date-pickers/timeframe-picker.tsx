import {Box, Grid, MenuItem, TextField} from "@mui/material";
import React, {ChangeEvent, useEffect} from "react";
import {Now, PlainDate, tryParsePlainDate} from "../temporal";
import {PlainDatePicker} from "./PlainDatePicker";

export enum TimeFrameType {
	All = "All",
	Today = "Today",
	Yesterday = "Yesterday",
	Last7Days = "Last7Days",
	LastWeek = "LastWeek",
	ThisMonth = "ThisMonth",
	LastMonth = "LastMonth",
	Last3Months = "Last3Months",
	LastYear = "LastYear",
	Custom = "Custom",
}

export interface FilterTimeFrame {
	type: TimeFrameType;
	from?: string | null;
	until?: string | null;
}

interface TimeFrameSelectProps {
	value: FilterTimeFrame;
	onChange: (value: FilterTimeFrame) => void;
	i18n?: {
		timeframeTitle?: string;
		from?: string;
		until?: string;
		types?: {
			All?: string;
			Today?: string;
			Yesterday?: string;
			Last7Days?: string;
			LastWeek?: string;
			ThisMonth?: string;
			LastMonth?: string;
			Last3Months?: string;
			LastYear?: string;
			Custom?: string;
		};
	};
}

export function TimeframePicker({value, onChange, i18n}: TimeFrameSelectProps) {
	const {
		type,
		from,
		until,
	} = value;

	const fromPlainDate = tryParsePlainDate(from) ?? null;
	const untilPlainDate = tryParsePlainDate(until) ?? null;

	useEffect(() => {
		const {from, until} = computeFromUntil(type, fromPlainDate, untilPlainDate);
		onChange({
			type,
			from: from?.toString(),
			until: until?.toString(),
		});
	}, [type, from, until]);

	function handleTypeChange(event: ChangeEvent<HTMLInputElement>) {
		const type = event.target.value as TimeFrameType;
		const {from, until} = computeFromUntil(type, fromPlainDate, untilPlainDate);
		onChange({
			type,
			from: from?.toString(),
			until: until?.toString(),
		});
	}

	function handleFromChange(value: PlainDate | null) {
		onChange({
			type,
			from: value?.toString(),
			until,
		});
	}

	function handleUntilChange(value: PlainDate | null) {
		onChange({
			type,
			from,
			until: value?.toString(),
		});
	}

	const {
		timeframeTitle: tTimeframeTitle,
		from: tFrom,
		until: tUntil,
		types: tTypes = {},
	} = i18n ?? {};

	return (
		<Box>
			<Grid container spacing={2}>
				<Grid item md={4} xs={12}>
					<TextField
						fullWidth
						select
						variant="outlined"
						label={tTimeframeTitle ?? "Timeframe"}
						value={type}
						onChange={handleTypeChange}
					>
						{Object.values(TimeFrameType).map(tf => (
							<MenuItem key={tf} value={tf}>{tTypes[tf] ?? tf}</MenuItem>
						))}
					</TextField>
				</Grid>
				<Grid item md={4} xs={12}>
					<PlainDatePicker
						label={tFrom ?? "From"}
						value={fromPlainDate}
						onChange={handleFromChange}
						disabled={type != TimeFrameType.Custom}
						fullWidth
					/>
				</Grid>
				<Grid item md={4} xs={12}>
					<PlainDatePicker
						label={tUntil ?? "Until"}
						value={untilPlainDate}
						onChange={handleUntilChange}
						disabled={type != TimeFrameType.Custom}
						fullWidth
					/>
				</Grid>
			</Grid>
		</Box>
	);
}

export function computeFromUntil(type: TimeFrameType, from?: PlainDate | null, until?: PlainDate | null) {
	const today = Now.plainDateISO();
	const yesterday = today.subtract({days: 1});
	const lastMonth = today.subtract({months: 1});
	const lastWeek = today.subtract({weeks: 1});
	const lastYear = today.subtract({years: 1});

	switch (type) {
		case TimeFrameType.All:
			return {from: undefined, until: undefined};

		case TimeFrameType.Custom:
			return {from, until};

		case TimeFrameType.Today:
			return {
				from: today,
				until: today,
			};

		case TimeFrameType.Yesterday:
			return {
				from: yesterday,
				until: yesterday,
			};

		case TimeFrameType.Last7Days:
			return {
				from: yesterday.subtract({days: 7}),
				until: yesterday,
			};

		case TimeFrameType.LastWeek:
			return {
				from: lastWeek.subtract({days: lastWeek.dayOfWeek - 1}),
				until: lastWeek.add({days: 7 - lastWeek.dayOfWeek}),
			};

		case TimeFrameType.ThisMonth:
			return {
				from: today.with({day: 1}),
				until: today.with({day: lastMonth.daysInMonth}),
			};

		case TimeFrameType.LastMonth:
			return {
				from: lastMonth.with({day: 1}),
				until: lastMonth.with({day: lastMonth.daysInMonth}),
			};

		case TimeFrameType.Last3Months:
			return {
				from: lastMonth.subtract({months: 3}).with({day: 1}),
				until: lastMonth.with({day: lastMonth.daysInMonth}),
			};

		case TimeFrameType.LastYear:
			return {
				from: lastYear.with({day: 1, month: 1}),
				until: lastYear.with({day: 31, month: 12}),
			};
	}
}
