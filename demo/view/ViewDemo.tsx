import {Box, Button, Chip, Skeleton} from "@mui/material";
import React, {useState} from "react";
import {BreadcrumbItem, BreadcrumbLink, Breadcrumbs, Checkbox, View, ViewHeader} from "../../src";
import {Demo, DemoControls, DemoSource} from "../demo";

// @ts-ignore
import source from "./ViewDemo.tsx?source";

export function ViewDemo() {
	const [loading, setLoading] = useState(false);
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
								title={loading ? <Skeleton width={100} /> : "Fruits"}
								subTitle={loading ? <Skeleton width={150} /> : "A demo view about fruits"}
								titleAdornment={loading ? <Skeleton width={40} /> : <Chip label="Active" />}
								actions={<Button variant="contained" color="primary">Do Something</Button>}
							/>
						</View>
					</DemoSource>
				</Box>
				<DemoControls>
					<Checkbox label="loading" value={loading} onChange={setLoading} />
				</DemoControls>
			</Demo>
		</Box>
	);
}
