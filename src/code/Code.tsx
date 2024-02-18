import React, {PropsWithChildren} from "react";
import {darken, lighten, Typography, TypographyProps, useTheme} from "@mui/material";

export interface CodeProps {
    variant?: TypographyProps["variant"];
    color?: TypographyProps["color"];
    display?: TypographyProps["display"];
    px?: TypographyProps["px"];
    py?: TypographyProps["py"];
}

export function Code(props: PropsWithChildren<CodeProps>) {
    const {
        variant,
        color,
        display,
        px = "0.25em",
        py = 0,
        children
    } = props;
    const theme = useTheme();

	const backgroundColor = theme.palette.mode == "light"
		? darken(theme.palette.background.default, 0.04)
		: theme.palette.background.paper

	const backgroundColorOnPaper = theme.palette.mode == "light"
		? darken(theme.palette.background.default, 0.025)
		: lighten(theme.palette.background.paper, 0.1);

    return (
        <Typography
            component="code"
            display={display}
            color={color}
            variant={variant}
            fontFamily="Jetbrains Mono"
            fontSize="inherit"
            px={px}
            py={py}
            whiteSpace="break-spaces"
            borderRadius="0.25em"
            sx={{
				bgcolor: backgroundColor,
				".MuiPaper-root &": {
					bgcolor: backgroundColorOnPaper,
				}
			}}
        >
            {children}
        </Typography>
    );
}
