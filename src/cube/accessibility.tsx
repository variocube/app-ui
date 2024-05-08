import {
	Box,
	CardContent,
	CardHeader,
	FormControl,
	FormControlLabel,
	FormLabel,
	Grid,
	Radio,
	RadioGroup,
	Table, TableBody,
	TableCell, TableHead,
	TableRow,
	Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { PlainTime, tryParsePlainTime } from "../temporal";
import React from "react";
import { EditForm } from "../forms";
import { Checkbox, TextField } from "../Input";
import { PlainTimePicker } from "../date-pickers";


export interface SiteAccessibility {
	alwaysAccessible: boolean;
	accessibleFrom?: string;
	accessibleUntil?: string;
	weekdayAccessibleHours: AccessibilityTimeframe[];
	accessDescription: string;
	externalAccess: ExternalAccess;
	externalAccessForeignId?: string;
}

export type ExternalAccess = "None" | "Storebox";

export interface AccessibilityTimeframe {
	weekday: Weekday;
	accessibleFrom?: string;
	accessibleUntil?: string;
}

export const Weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

export type Weekday = typeof Weekdays[number];


export function Accessibility({ enabled, loading, result, t, onSave }: { enabled: boolean, loading: boolean, result: SiteAccessibility, t: any, onSave: any }) {

	//const id = useParam("id");
	//const {t} = useLocalization();

	//const {loading, error, result} = useAsync(() => siteApi.getAccessibility(id), [id]);

	const [alwaysAccessible, setAlwaysAccessible] = useState(true);
	const [accessibleFrom, setAccessibleFrom] = useState<PlainTime | null>(null);
	const [accessibleUntil, setAccessibleUntil] = useState<PlainTime | null>(null);

	const [weekdayAccessibility, setWeekdayAccessibility] = useState(EMPTY_WEEKDAY_ACCESSIBLE_HOURS);
	const [accessDescription, setAccessDescription] = useState("");
	const [externalAccess, setExternalAccess] = useState<ExternalAccess>("None");
	const [externalAccessForeignId, setExternalAccessForeignId] = useState("");

	useEffect(() => {
		if (result) {
			setAlwaysAccessible(result.alwaysAccessible);
			setAccessibleFrom(tryParsePlainTime(result.accessibleFrom) ?? null);
			setAccessibleUntil(tryParsePlainTime(result.accessibleUntil) ?? null);
			setWeekdayAccessibility(completeWeekdayAccessibleHours(result.weekdayAccessibleHours));
			setAccessDescription(result.accessDescription);
			setExternalAccess(result.externalAccess);
			setExternalAccessForeignId(result.externalAccessForeignId ?? "");
		}
	}, [result]);

	async function handleSave() {
		var objToSave =  {
			alwaysAccessible,
			accessibleFrom: accessibleFrom?.toString(),
			accessibleUntil: accessibleUntil?.toString(),
			weekdayAccessibleHours: weekdayAccessibility,
			accessDescription,
			externalAccess,
			externalAccessForeignId,
		};
		await onSave(objToSave);
		// await siteApi.updateAccessibility(id,objToSave)
	}

	function handleWeekdayAccessibleFromChange(weekday: Weekday, value: PlainTime | null) {
		setWeekdayAccessibility(prev => prev.map(timeframe => {
			return timeframe.weekday != weekday ? timeframe : { ...timeframe, accessibleFrom: value?.toString() };
		}));
	}

	function handleWeekdayAccessibleUntilChange(weekday: Weekday, value: PlainTime | null) {
		setWeekdayAccessibility(prev => prev.map(timeframe => {
			return timeframe.weekday != weekday ? timeframe : { ...timeframe, accessibleUntil: value?.toString() };
		}));
	}

	if (!enabled) {
		return (
			<Typography>{t("sites.settings.enableBookingRequired")}</Typography>
		)
	}

	return (
		<Box maxWidth="md">
			<EditForm loading={loading} onSave={handleSave}>
				<CardHeader
					title={t("sites.accessibility.accessibleHours")}
					subheader={t("sites.accessibility.accessibleHoursIntro")}
				/>
				<CardContent>
					<Checkbox
						label={t("sites.accessibility.alwaysAccessible")}
						checked={alwaysAccessible}
						onChange={setAlwaysAccessible}
					/>
				</CardContent>

				<CardHeader
					disableTypography
					title={
						<Typography variant="subtitle1">
							{t("sites.accessibility.generalAccessibleHours")}
						</Typography>
					}
					subheader={
						<Typography variant="body2">
							{t("sites.accessibility.generalAccessibleHoursHelperText")}
						</Typography>
					}
				/>
				<CardContent>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6} md={4}>
							<PlainTimePicker
								label={t("sites.accessibility.accessibleFrom")}
								disabled={alwaysAccessible}
								value={accessibleFrom}
								onChange={setAccessibleFrom}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<PlainTimePicker
								label={t("sites.accessibility.accessibleUntil")}
								disabled={alwaysAccessible}
								value={accessibleUntil}
								onChange={setAccessibleUntil}
								fullWidth
							/>
						</Grid>
					</Grid>
				</CardContent>

				<CardHeader
					disableTypography
					title={
						<Typography variant="subtitle1">
							{t("sites.accessibility.accessibleHoursByWeekday")}
						</Typography>
					}
					subheader={
						<Typography variant="body2">
							{t("sites.accessibility.accessibleHoursByWeekdayHelperText")}
						</Typography>
					}
				/>
				<CardContent>
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell>{t("sites.accessibility.weekday")}</TableCell>
								<TableCell>{t("sites.accessibility.accessibleFrom")}</TableCell>
								<TableCell>{t("sites.accessibility.accessibleUntil")}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{weekdayAccessibility.map(({ weekday, accessibleFrom, accessibleUntil }) => (
								<TableRow key={weekday}>
									<TableCell>{t(`weekdays.${weekday}`)}</TableCell>
									<TableCell>
										<PlainTimePicker
											disabled={alwaysAccessible}
											size="small"
											value={tryParsePlainTime(accessibleFrom) ?? null}
											onChange={value => handleWeekdayAccessibleFromChange(weekday, value)}
										/>
									</TableCell>
									<TableCell>
										<PlainTimePicker
											disabled={alwaysAccessible}
											size="small"
											value={tryParsePlainTime(accessibleUntil) ?? null}
											onChange={value => handleWeekdayAccessibleUntilChange(weekday, value)}
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>

				<CardHeader
					title={t("sites.accessibility.accessDescription")}
					subheader={t("sites.accessibility.accessDescriptionHelperText")}
				/>
				<CardContent>
					<TextField
						label={t("sites.accessibility.accessDescription")}
						value={accessDescription}
						multiline
						rows={3}
						fullWidth
						onChange={setAccessDescription}
					/>
				</CardContent>

				<CardHeader
					title={t("sites.accessibility.externalAccess")}
					subheader={t("sites.accessibility.externalAccessIntro")}
				/>
				<CardContent>
					<Grid container spacing={2}>
						<Grid item>
							<FormControl>
								<FormLabel>{t("sites.accessibility.externalAccess")}</FormLabel>
								<RadioGroup
									value={externalAccess}
									onChange={e => setExternalAccess(e.currentTarget.value as "None" | "Storebox")}
									row
								>
									<FormControlLabel
										value="None"
										control={<Radio />}
										label={"None"}
									/>
									<FormControlLabel
										value="Storebox"
										control={<Radio />}
										label={"Storebox"}
									/>
								</RadioGroup>
							</FormControl>
						</Grid>
						<Grid item>
							<TextField
								label={t("sites.accessibility.externalAccessForeignId")}
								disabled={externalAccess == "None"}
								value={externalAccessForeignId}
								onChange={setExternalAccessForeignId}
							/>
						</Grid>
					</Grid>
				</CardContent>

			</EditForm>
		</Box>
	)
}

function completeWeekdayAccessibleHours(value: AccessibilityTimeframe[]) {
	return EMPTY_WEEKDAY_ACCESSIBLE_HOURS.map(({ weekday }) => {
		const weekdayValue = value.find(v => v.weekday == weekday);
		return ({
			weekday,
			accessibleFrom: weekdayValue?.accessibleFrom,
			accessibleUntil: weekdayValue?.accessibleUntil,
		})
	})
}

const EMPTY_WEEKDAY_ACCESSIBLE_HOURS: AccessibilityTimeframe[] = [
	{ weekday: "Monday", accessibleFrom: undefined, accessibleUntil: undefined },
	{ weekday: "Tuesday", accessibleFrom: undefined, accessibleUntil: undefined },
	{ weekday: "Wednesday", accessibleFrom: undefined, accessibleUntil: undefined },
	{ weekday: "Thursday", accessibleFrom: undefined, accessibleUntil: undefined },
	{ weekday: "Friday", accessibleFrom: undefined, accessibleUntil: undefined },
	{ weekday: "Saturday", accessibleFrom: undefined, accessibleUntil: undefined },
	{ weekday: "Sunday", accessibleFrom: undefined, accessibleUntil: undefined },
]
