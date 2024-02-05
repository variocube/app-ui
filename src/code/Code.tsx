import React, {PropsWithChildren} from "react";
import {Typography, TypographyProps, useTheme} from "@mui/material";

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
    const backgroundAlpha = theme.palette.mode == "light" ? 0.15 : 0.35;

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
            bgcolor={`rgba(128, 128, 128, ${backgroundAlpha})`}
        >
            {children}
        </Typography>
    );
}