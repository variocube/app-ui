import React, {createElement, PropsWithChildren} from "react";
import {Breakpoint} from "@mui/system";
import {Box, Container} from "@mui/material";
import {containerWidthToBreakPoint, useContainerSettingsContext} from "./ContainerSettingsContext";

interface ContainerLayoutProps extends PropsWithChildren<any> {
	fixedWidth?: Breakpoint | false;
	margin?: number;
}

export function ContainerLayout({children, fixedWidth, margin}: ContainerLayoutProps) {

	const {width} = useContainerSettingsContext();
	let selectedWidth = fixedWidth;
	if(!selectedWidth && width) {
		selectedWidth = containerWidthToBreakPoint(width);
	}

	return (
		<Container maxWidth={selectedWidth} id="containerLayout">
			<Box
				marginTop={margin != undefined ? margin : 5}
				id="containerLayoutBoxScreen"
				display="block"
				displayPrint="none"
			>
				{children}
			</Box>
			<Box id="containerLayoutBoxPrint" display="none" displayPrint="block" style={{marginTop: "-32px"}}>
				{children}
			</Box>
		</Container>
	);
}
