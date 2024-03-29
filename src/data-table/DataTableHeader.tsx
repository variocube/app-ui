import React, {PropsWithChildren} from "react";
import {Box} from "@mui/material";

export function DataTableHeader({children}: PropsWithChildren<{}>) {
    return (
        <Box p={2} display="flex" alignItems="center">
            {children}
        </Box>
    )
}
