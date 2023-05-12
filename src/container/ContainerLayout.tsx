import React, {createElement, PropsWithChildren} from "react";
import {Breakpoint} from "@mui/system";
import {Box, Container} from "@mui/material";
import {containerWidthToBreakPoint, useContainerSettingsContext} from "./ContainerSettingsContext";
import {useHelpSettingsContext} from "../help/HelpSettingsContext";
import {HelpDrawer} from "../help/HelpDrawer";

interface ContainerLayoutProps extends PropsWithChildren<any> {
	fixedWidth?: Breakpoint | false;
	margin?: number;
}

export function ContainerLayout({children, fixedWidth, margin, helpKey}: ContainerLayoutProps) {
	const {width} = useContainerSettingsContext();
	const {baseUrl} = useHelpSettingsContext();

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
				{baseUrl &&
					<HelpDrawer />
				}
			</Box>
			<Box id="containerLayoutBoxPrint" display="none" displayPrint="block" style={{marginTop: "-32px"}}>
				{children}
			</Box>
		</Container>
	);
}
