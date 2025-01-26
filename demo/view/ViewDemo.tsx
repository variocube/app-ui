import {Box, Button, Chip} from "@mui/material";
import React from "react";
import {BreadcrumbItem, BreadcrumbLink, Breadcrumbs, View, ViewHeader} from "../../src";
import {Demo, DemoSource} from "../demo";

// @ts-ignore
import source from "./ViewDemo.tsx?source";

export function ViewDemo() {
	return (
		<Box>
			<Demo source={source} id="view">
				<Box py={2}>
					<DemoSource for="#view">
						<View>
							<Breadcrumbs>
								<BreadcrumbLink href="#">Items</BreadcrumbLink>
								<BreadcrumbLink href="#">Food</BreadcrumbLink>
								<BreadcrumbItem>Fruits</BreadcrumbItem>
							</Breadcrumbs>
							<ViewHeader
								title="Fruits"
								subTitle="A demo view about fruits"
								titleAdornment={<Chip label="Active" />}
								actions={<Button variant="contained" color="primary">Do Something</Button>}
							/>
						</View>
					</DemoSource>
				</Box>
			</Demo>
		</Box>
	);
}
