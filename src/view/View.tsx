import {Container, ContainerProps, Stack} from "@mui/material";
import React, {PropsWithChildren} from "react";
import {ErrorAlert} from "../ErrorAlert";

export interface ViewProps extends ContainerProps {
	loading?: boolean;
	error?: any;
	spacing?: number;
	py?: number;
}

export function View(props: PropsWithChildren<ViewProps>) {
	const {maxWidth, loading, error, spacing = 2, py = 4, children, ...containerProps} = props;
	return (
		<Container maxWidth={maxWidth} {...containerProps}>
			<Stack spacing={spacing} py={py} sx={{opacity: loading ? 0.5 : 1}}>
				{error && <ErrorAlert error={error} />}
				{children}
			</Stack>
		</Container>
	);
}
