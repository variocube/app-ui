import BlockIcon from "@mui/icons-material/Block";
import {
	Badge,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Container,
	Link,
	Stack,
	Typography,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";
import {useState} from "react";
import {
	PageTitle,
	PlainDate,
	PlainDatePicker,
	PlainDateTime,
	PlainDateTimePicker,
	PlainTime,
	PlainTimePicker,
	TimezoneSelect,
} from "../../src";

export function Pickers() {
	return (
		<Container>
			<PageTitle title="Date & time pickers" gutterBottom />
			<Typography variant="body1" gutterBottom>
				The date and time pickers in this library are based on the{"  "}
				<Link href="https://tc39.es/proposal-temporal/docs/index.html" target="_blank">Temporal proposal</Link>,
				which will be part of ES and be built into browsers. In the meantime we use a polyfill implementation.
			</Typography>
			<Typography variant="h2" gutterBottom>
				Date picker
			</Typography>
			<Typography variant="body1" gutterBottom>
				A date picker lets the user enter a date either by selecting it on a calender or by entering the date
				with the keyboard in the format determined by the user's locale.
			</Typography>
			<Stack spacing={2}>
				<DatePicker />
				<DateTimePicker />
				<TimePicker />
				<TimezoneSelectDemo />
			</Stack>
		</Container>
	);
}

export function DatePicker() {
	const [value, setValue] = useState<PlainDate | null>(null);
	const invalidDays = [4, 13, 18, 22, 30];
	return (
		<Card>
			<CardHeader title="Date picker" />
			<CardContent>
				<PlainDatePicker
					label="Date picker"
					value={value}
					onChange={setValue}
				/>
				<PlainDatePicker
					label="Custom render day"
					value={value}
					onChange={day => {
						if (!day) setValue(null);
						else {
							setValue(prev => !invalidDays.includes(day.day) ? day : prev);
						}
					}}
					renderDay={(day) => {
						return invalidDays.includes(day.day)
							? (
								(
									<Tooltip title="Not available">
										<Badge
											badgeContent={
												<BlockIcon
													sx={{fontSize: "15px", position: "relative", top: -1, right: -2}}
													color="error"
												/>
											}
										>
											<Typography variant="body2" color="textSecondary">{day.day}</Typography>
										</Badge>
									</Tooltip>
								)
							)
							: <span>{day.day}</span>;
					}}
				/>
			</CardContent>
		</Card>
	);
}

export function DateTimePicker() {
	const [value, setValue] = useState<PlainDateTime | null>(null);
	return (
		<Card>
			<CardHeader title="Datetime picker" />
			<CardContent>
				<PlainDateTimePicker
					label="Datetime picker"
					value={value}
					onChange={setValue}
				/>
			</CardContent>
		</Card>
	);
}

export function TimePicker() {
	const [value, setValue] = useState<PlainTime | null>(null);
	return (
		<Card>
			<CardHeader title="Time picker" />
			<CardContent>
				<PlainTimePicker
					label="Time picker"
					value={value}
					onChange={setValue}
				/>
			</CardContent>
		</Card>
	);
}

export function TimezoneSelectDemo() {
	const [value, setValue] = useState<string | null>(null);
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => e.preventDefault();
	return (
		<Card>
			<CardHeader title="Timezone select" />
			<form onSubmit={handleSubmit}>
				<CardContent>
					<TimezoneSelect
						label="Time zone"
						value={value}
						onChange={setValue}
					/>
					<TimezoneSelect
						label="Required time zone"
						value={value}
						onChange={setValue}
						required
					/>
				</CardContent>
				<CardActions>
					<Button color="primary" type="submit">
						Submit
					</Button>
				</CardActions>
			</form>
		</Card>
	);
}
