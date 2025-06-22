import {Numbers} from "@mui/icons-material";
import {
	Avatar,
	Box,
	Container,
	ListItem,
	ListItemIcon,
	ListItemProps,
	ListItemText,
	ListItemTextProps,
	Typography,
} from "@mui/material";
import React, {useState} from "react";
import {Code, List, PageTitle, Switch} from "../../src";
import {Demo, DemoControls, DemoSource} from "../demo";

// @ts-ignore
import source from "./ListDemo.tsx?source";

export function ListDemo() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [divider, setDivider] = useState(false);
	return (
		<Container maxWidth="md">
			<PageTitle title="List" gutterBottom />
			<Box>
				<Typography variant="h2" gutterBottom>
					<Code>List</Code>
				</Typography>
				<Typography variant="subtitle1" gutterBottom>
					Extension of MUIs <Code>List</Code>{" "}
					component that can show skeleton list items while loading and shows an error.
				</Typography>
				<Typography variant="body2" gutterBottom>
					You can pass in a <Code>skeleton</Code> prop to customize the skeleton list items.
				</Typography>
				<Demo source={source} id="list">
					<DemoSource for="#list">
						<List loading={loading} error={error} skeleton={{divider}}>
							<DemoListItem
								divider={divider}
								primary="Item 1"
								secondary="This is the first item in the list."
							/>
							<DemoListItem
								divider={divider}
								primary="Item 2"
								secondary="Secondary text of the second item."
							/>
							<DemoListItem
								divider={divider}
								primary="Item 3"
								secondary="The third list item's secondary text."
							/>
						</List>
					</DemoSource>
					<DemoControls>
						<Switch value={loading} onChange={setLoading} label="Loading" />
						<Switch value={error} onChange={setError} label="Error" />
						<Switch value={divider} onChange={setDivider} label="Divider" />
					</DemoControls>
				</Demo>
			</Box>
		</Container>
	);
}

type DemoListItemProps = Pick<ListItemTextProps, "primary" | "secondary"> & Pick<ListItemProps, "divider">;

function DemoListItem(props: DemoListItemProps) {
	const {primary, secondary, divider} = props;
	return (
		<ListItem divider={divider}>
			<ListItemIcon>
				<Avatar>
					<Numbers />
				</Avatar>
			</ListItemIcon>
			<ListItemText primary={primary} secondary={secondary} />
		</ListItem>
	);
}
