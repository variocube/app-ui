import {Box, BoxProps, CardContent, Chip, Container, Stack, Typography} from "@mui/material";
import React, {useState} from "react";
import {Checkbox, Code, createSimpleTFunc, Filter, PageTitle} from "../../src";
import {Demo, DemoControls, DemoSource} from "../demo";

// @ts-ignore
import source from "./index.tsx?source";

export function FilterDemoPage() {
	return (
		<Container>
			<PageTitle title="Filter" gutterBottom />
			<Stack spacing={8}>
				<FilterDemo />
			</Stack>
		</Container>
	);
}

function FilterDemo(props: BoxProps) {
	const [enableSearch, setEnableSearch] = useState(false);
	const [fullWidth, setFullWidth] = useState(false);
	const [search, setSearch] = useState("");
	const [option1, setOption1] = useState(false);
	const [option2, setOption2] = useState(false);

	function handleClear() {
		setSearch("");
		setOption1(false);
		setOption2(false);
	}

	return (
		<Box {...props}>
			<Typography variant="h2" gutterBottom>
				<Code>Filter</Code>
			</Typography>
			<Typography variant="subtitle1" gutterBottom>
				Displays an input for filtering.
			</Typography>
			<Demo source={source} id="filter">
				<Box p={2}>
					<DemoSource for="#filter">
						<Filter
							label="Filter"
							fullWidth={fullWidth}
							enableSearch={enableSearch}
							onSearch={setSearch}
							onClear={handleClear}
							labels={t}
							active={[
								option1 && <Chip label={"Filter Option 1"} onDelete={() => setOption1(false)} />,
								option2 && <Chip label={"Filter Option 2"} onDelete={() => setOption2(false)} />,
								search && <Chip label={`Search: ${search}`} onDelete={() => setSearch("")} />,
							]}
							onFilterClick={() => console.log('Open filter')}
						>
							<CardContent>
								<Checkbox label="Filter Option 1" value={option1} onChange={setOption1} />
								<Checkbox label="Filter Option 2" value={option2} onChange={setOption2} />
							</CardContent>
						</Filter>
					</DemoSource>
				</Box>
				<DemoControls>
					<Checkbox label="enableSearch" value={enableSearch} onChange={setEnableSearch} />
					<Checkbox label="fullWidth" value={fullWidth} onChange={setFullWidth} />
				</DemoControls>
			</Demo>
		</Box>
	);
}

const t = createSimpleTFunc({none: "No filter set", search: "Search", reset: "Reset"});
