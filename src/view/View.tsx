import {Container, ContainerProps, Stack} from "@mui/material";
import React, {PropsWithChildren} from "react";
import {ErrorAlert} from "../ErrorAlert";

export interface ViewProps {
	maxWidth?: ContainerProps["maxWidth"];
	loading?: boolean;
	error?: any;
	spacing?: number;
}

export function View(props: PropsWithChildren<ViewProps>) {
	const {maxWidth, loading, error, spacing = 2, children} = props;
	return (
		<Container maxWidth={maxWidth}>
			<Stack spacing={spacing} sx={{opacity: loading ? 0.5 : 1}}>
				{error && <ErrorAlert error={error} />}
				{children}
			</Stack>
		</Container>
	);
}
