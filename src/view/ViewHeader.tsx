import {Box, Grid, Stack, Typography} from "@mui/material";
import React, {PropsWithChildren} from "react";
import {PageTitle} from "../layout";

export interface ViewHeaderProps {
	title?: string;
	titleAdornment?: React.ReactNode;
	subTitle?: React.ReactNode;
	actions?: React.ReactNode;
}

export function ViewHeader(props: PropsWithChildren<ViewHeaderProps>) {
	const {title, titleAdornment, subTitle, actions} = props;
	return (
		<Box>
			<Grid container spacing={2} justifyContent="space-between" alignItems="center">
				<Grid item xs>
					<Stack direction="row" spacing={2} alignItems="center">
						<PageTitle title={title} />
						{titleAdornment}
					</Stack>
					<Typography variant="subtitle1">
						{subTitle}
					</Typography>
				</Grid>
				{actions && (
					<Grid item>
						{actions}
					</Grid>
				)}
			</Grid>
		</Box>
	);
}
