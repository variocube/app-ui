import {Box} from "@mui/material";
import React, {PropsWithChildren} from "react";

export function DataTableHeader({children}: PropsWithChildren<{}>) {
	return (
		<Box p={2} display="flex" alignItems="center">
			{children}
		</Box>
	);
}
