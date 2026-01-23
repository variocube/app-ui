import {Box, BoxProps} from "@mui/material";
import React from "react";
import {useCustomLogo} from "../VCThemeProvider";
import {VCLogo} from "./VCLogo";

interface LogoProps extends Omit<BoxProps, "height"> {
	height?: number | string | undefined;
}

export function Logo(props: LogoProps) {
	const {height = 52, ...rest} = props;
	const customLogo = useCustomLogo();
	if (customLogo) {
		const {url, paddingX, paddingY} = customLogo;
		return (
			<Box {...rest}>
				<Box
					component="img"
					src={url}
					px={paddingX ?? 0}
					py={paddingY ?? 0}
					height={height}
					width="auto"
				/>
			</Box>
		);
	} else {
		return (
			<Box {...rest}>
				<VCLogo height={height} width="auto" />
			</Box>
		);
	}
}
