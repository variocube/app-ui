import {Delete, Edit, Warning} from "@mui/icons-material";
import {Box, BoxProps, Container, List, MenuItem, Stack, Typography} from "@mui/material";
import * as React from "react";
import {Fragment} from "react";
import {Code, ConfirmButton, ConfirmIconButton, ConfirmMenuItem, PageTitle, TextField} from "../../src";
import {Demo, DemoSource} from "../demo";

// @ts-ignore
import source from "./index.tsx?source";

export function ConfirmDemo() {
	return (
		<Container>
			<Stack spacing={8}>
				<PageTitle title="Confirm" gutterBottom />

				<ConfirmButtonDemo />
				<ConfirmMenuItemDemo />
				<ConfirmIconButtonDemo />
			</Stack>
		</Container>
	);
}

export function ConfirmButtonDemo(props: BoxProps) {
	return (
		<Box {...props}>
			<Typography variant="h2" gutterBottom>
				<Code>ConfirmButton</Code>
			</Typography>
			<Typography variant="subtitle1" gutterBottom>
				A confirm button shows a confirmation dialog when clicked and asking the user whether they really want
				to execute the action.
			</Typography>

			<Demo source={source} id="confirm-button">
				<DemoSource>
					<Stack direction="row" spacing={1}>
						<ConfirmButton
							title="Do the dangerous thing"
							cancel="Cancel"
							onConfirm={theDangerousThing}
							icon={<Warning />}
							color="warning"
							variant="outlined"
						>
							Are you sure you want to do the dangerous thing?
						</ConfirmButton>
						<ConfirmButton
							title="Delete something"
							cancel="Cancel"
							onConfirm={theDangerousThing}
							icon={<Delete />}
							color="error"
							variant="outlined"
						>
							<TextField
								label={
									<Fragment>
										Type <em>delete</em> to confirm.
									</Fragment>
								}
								inputProps={{pattern: "delete"}}
								required
							/>
						</ConfirmButton>
						<ConfirmButton
							title="Edit value"
							confirmTitle="Save value"
							cancel="Cancel"
							onConfirm={theDangerousThing}
							icon={<Edit />}
							variant="outlined"
						>
							<TextField
								label="Value"
								defaultValue="foo"
								required
							/>
						</ConfirmButton>
					</Stack>
				</DemoSource>
			</Demo>
		</Box>
	);
}

export function ConfirmMenuItemDemo(props: BoxProps) {
	return (
		<Box {...props}>
			<Typography variant="h2" gutterBottom>
				<Code>ConfirmMenuItem</Code>
			</Typography>
			<Typography variant="subtitle1" gutterBottom>
				A confirm menu item works just like a confirm button, but as a menu item.
			</Typography>

			<Demo source={source} id="confirm-menu-item">
				<DemoSource>
					<List>
						<MenuItem>A menu item</MenuItem>
						<ConfirmMenuItem
							title="Do the dangerous thing"
							cancel="Cancel"
							onConfirm={theDangerousThing}
							icon={<Delete />}
							color="error"
						>
							Are you sure you want to do the dangerous thing?
						</ConfirmMenuItem>
						<MenuItem>Another menu item</MenuItem>
					</List>
				</DemoSource>
			</Demo>
		</Box>
	);
}

export function ConfirmIconButtonDemo(props: BoxProps) {
	return (
		<Box {...props}>
			<Typography variant="h2" gutterBottom>
				<Code>ConfirmIconButton</Code>
			</Typography>
			<Typography variant="subtitle1" gutterBottom>
				A confirm icon button works just like a confirm button, but as an icon button.
			</Typography>

			<Demo source={source} id="confirm-icon-button">
				<DemoSource>
					<ConfirmIconButton
						icon={<Delete />}
						title={"Delete"}
						cancel={"Cancel"}
						color="error"
						onConfirm={theDangerousThing}
					>
						Are you sure you want to do the dangerous thing?
					</ConfirmIconButton>
				</DemoSource>
			</Demo>
		</Box>
	);
}

function theDangerousThing() {
	return new Promise<void>(resolve => setTimeout(resolve, 500));
}
