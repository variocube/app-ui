import React, {PropsWithChildren} from "react";
import {Stack} from "@mui/material";

export function DataTableToolbar({children}: PropsWithChildren<{}>) {
    return (
        <Stack spacing={1} pl={1} minHeight="52px" direction="row" alignItems="center">
            {children}
        </Stack>
    )
}
