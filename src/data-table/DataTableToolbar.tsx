import {Stack} from "@mui/material";
import React, {PropsWithChildren} from "react";

export function DataTableToolbar({children}: PropsWithChildren<{}>) {
	return (
		<Stack spacing={1} pl={1} minHeight="52px" direction="row" alignItems="center">
			{children}
		</Stack>
	);
}
