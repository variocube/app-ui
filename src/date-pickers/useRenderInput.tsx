import * as React from "react";
import {useCallback} from "react";
import {TextFieldProps} from "@mui/material/TextField/TextField";
import {TextField} from "@mui/material";

export function useRenderInput(fullWidth: boolean | undefined) {
    return useCallback((props: TextFieldProps) => (
        <TextField variant="outlined" fullWidth={fullWidth} {...props}/>
    ), [fullWidth]);
}