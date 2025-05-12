import {Box, Container, Stack, Typography} from "@mui/material";
import React from "react";
import {ApiError, Code, ErrorAlert, PageTitle} from "../../src";
import {Demo, DemoSource} from "../demo";

// @ts-ignore
import source from "./ErrorAlertDemo.tsx?source";

export function ErrorAlertDemo() {
	return (
		<Container maxWidth="md">
			<PageTitle title="Inputs" gutterBottom/>
			<Box>
				<Typography variant="h2" gutterBottom>
					<Code>ErrorAlert</Code>
				</Typography>
				<Typography variant="subtitle1" gutterBottom>
					Displays an error of various shapes, most notably an <Code>ApiError</Code>.
				</Typography>
				<Demo source={source} id="error-alert">
					<Stack
						spacing={2}
						p={2}
					>
						<DemoSource for="#error-alert">
							<ErrorAlert error="Something went wrong"/>
							<ErrorAlert error={new Error("Something went wrong")}/>
							<ErrorAlert error={{
								title: "Something went wrong",
								detail: "A really bad error happened.",
								email: "support@variocube.com"
							}}/>
							<ErrorAlert error={new ApiError({
								title: "Bad request",
								detail: "The specified time-frame is invalid.",
								status: 400,
								instance: "https://example.com/api/data",
								type: "https://example.com/errors/invalid-time-frame"
							})}/>
						</DemoSource>
					</Stack>
				</Demo>
			</Box>
		</Container>
	);
}
