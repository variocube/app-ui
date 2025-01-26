import {Container, Stack} from "@mui/material";
import React from "react";
import {PageTitle} from "../../src";
import {ViewDemo} from "./ViewDemo";

export function ViewDemoPage() {
	return (
		<Container>
			<PageTitle title="View" gutterBottom />
			<Stack spacing={8}>
				<ViewDemo />
			</Stack>
		</Container>
	);
}
