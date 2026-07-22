import {
	Avatar,
	Box,
	BoxProps,
	Button,
	Container,
	ListItem,
	ListItemIcon,
	ListItemText,
	Stack,
	Typography,
} from "@mui/material";
import * as React from "react";
import {useCallback, useState} from "react";
import {Code, GlobalSearchDialog, Highlight, PageTitle, SearchIcon, useGlobalSearchHotkey} from "../../src";
import {Demo, DemoSource} from "../demo";

// @ts-ignore
import source from "./index.tsx?source";

export function SearchDemo() {
	return (
		<Container>
			<Stack spacing={8}>
				<PageTitle title="Search" gutterBottom />

				<GlobalSearchDialogDemo />
			</Stack>
		</Container>
	);
}

interface Fruit {
	name: string;
	color: string;
}

const fruits: Fruit[] = [
	{name: "Apple", color: "red"},
	{name: "Apricot", color: "orange"},
	{name: "Banana", color: "yellow"},
	{name: "Blueberry", color: "blue"},
	{name: "Cherry", color: "red"},
	{name: "Grape", color: "green"},
	{name: "Lemon", color: "yellow"},
	{name: "Orange", color: "orange"},
	{name: "Pear", color: "green"},
	{name: "Strawberry", color: "red"},
];

async function searchFruits(tokens: string[]) {
	// Simulate a server-side search with some latency.
	await new Promise(resolve => setTimeout(resolve, 300));
	return fruits.filter(fruit =>
		tokens.every(token =>
			fruit.name.toLowerCase().includes(token.toLowerCase())
			|| fruit.color.toLowerCase().includes(token.toLowerCase())
		)
	);
}

export function GlobalSearchDialogDemo(props: BoxProps) {
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState<Fruit>();
	const handleOpen = useCallback(() => setOpen(true), []);
	useGlobalSearchHotkey(handleOpen);

	return (
		<Box {...props}>
			<Typography variant="h2" gutterBottom>
				<Code>GlobalSearchDialog</Code>
			</Typography>
			<Typography variant="subtitle1" gutterBottom>
				A global search dialog around a MUI Autocomplete with server-side filtering. It handles input
				tokenization, debouncing, a minimum query length and a stale-result guard, while the actual search,
				result rendering and selection handling are provided via props. The accompanying{" "}
				<Code>useGlobalSearchHotkey</Code> hook opens it on Ctrl+K / Cmd+K, and <Code>Highlight</Code>{" "}
				emphasizes the matched parts of a result.
			</Typography>

			<Demo source={source} id="global-search-dialog">
				<Stack direction="row" spacing={2} alignItems="center" p={2}>
					<DemoSource for="#global-search-dialog">
						<Button variant="outlined" startIcon={<SearchIcon />} onClick={handleOpen}>
							Search (Ctrl+K)
						</Button>
						<GlobalSearchDialog
							open={open}
							onClose={() => setOpen(false)}
							search={searchFruits}
							onSelect={setSelected}
							getOptionLabel={fruit => fruit.name}
							groupBy={fruit => fruit.color}
							renderOption={(props, fruit, {inputValue}) => (
								<ListItem {...props}>
									<ListItemIcon>
										<Avatar>{fruit.name.charAt(0)}</Avatar>
									</ListItemIcon>
									<ListItemText
										primary={<Highlight text={fruit.name} highlight={inputValue} />}
										secondary={<Highlight text={fruit.color} highlight={inputValue} />}
									/>
								</ListItem>
							)}
							title="Search fruits"
							placeholder="Search"
							helperText="Search by name or color, e.g. “berry” or “red”."
							noOptionsText="No fruits found."
							loadingText="Searching…"
							closeLabel="Close"
							backLabel="Back"
							clearLabel="Clear"
						/>
					</DemoSource>
					{selected && (
						<Typography variant="body2">
							Selected: {selected.name} ({selected.color})
						</Typography>
					)}
				</Stack>
			</Demo>
		</Box>
	);
}
