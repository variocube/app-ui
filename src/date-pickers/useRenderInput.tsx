import * as React from "react";
import {useCallback} from "react";
import {TextFieldProps} from "@mui/material/TextField/TextField";
import {TextField} from "@mui/material";

export type UseRenderInputProps = Pick<TextFieldProps, "fullWidth" | "helperText" | "size">;

export function useRenderInput(props: UseRenderInputProps) {
    const {fullWidth, helperText, size} = props;
    return useCallback((props: TextFieldProps) => (
        <TextField
            variant="outlined"
            fullWidth={fullWidth}
            helperText={helperText}
            size={size}
            {...props}
        />
    ), [fullWidth, helperText, size]);
}