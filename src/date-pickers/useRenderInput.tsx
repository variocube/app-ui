import {TextField} from "@mui/material";
import {TextFieldProps} from "@mui/material/TextField/TextField";
import * as React from "react";
import {useCallback, useMemo} from "react";

export type UseRenderInputProps = Pick<TextFieldProps, "fullWidth" | "helperText" | "size" | "required">;

export function useRenderInput(props: UseRenderInputProps) {
	const {fullWidth, helperText, size, required} = props;

	// Create a stable forwardRef component
	const RenderInputComponent = useMemo(
		() =>
			React.forwardRef<any, TextFieldProps>((props, ref) => (
				<TextField
					variant="outlined"
					fullWidth={fullWidth}
					helperText={helperText}
					size={size}
					required={required}
					{...props}
					inputRef={ref}
				/>
			)),
		[fullWidth, helperText, size, required],
	);

	return useCallback((props: TextFieldProps) => <RenderInputComponent {...props} />, [RenderInputComponent]);
}
