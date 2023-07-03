import * as React from "react";
import {useCallback} from "react";
import {TextFieldProps} from "@mui/material/TextField/TextField";
import {TextField} from "@mui/material";

export type UseRenderInputProps = Pick<TextFieldProps, "fullWidth" | "helperText" | "size" | "required">;

export function useRenderInput(props: UseRenderInputProps) {
    const {fullWidth, helperText, size, required} = props;
    return useCallback((props: TextFieldProps) => (
        <TextField
            variant="outlined"
            fullWidth={fullWidth}
            helperText={helperText}
            size={size}
            required={required}
            {...props}
        />
    ), [fullWidth, helperText, size]);
}