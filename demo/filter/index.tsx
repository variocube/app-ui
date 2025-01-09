import {Box, BoxProps, CardContent, Chip, Container, Stack, Typography} from "@mui/material";
import React, {useState} from "react";
import {Checkbox, Code, createSimpleTFunc, Filter, PageTitle, Select} from "../../src";
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
	const [search, setSearch] = useState("");
	const [option1, setOption1] = useState(false);
	const [option2, setOption2] = useState(false);
	const [option3, setOption3] = useState<"one" | "two" | "three" | "four">();

	function handleClear() {
		setSearch("");
		setOption1(false);
		setOption2(false);
		setOption3(undefined);
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
							enableSearch={enableSearch}
							onSearch={setSearch}
							onClear={handleClear}
							labels={t}
							active={[
								option1 && <Chip label={"Filter Option 1"} onDelete={() => setOption1(false)} />,
								option2 && <Chip label={"Filter Option 2"} onDelete={() => setOption2(false)} />,
								option3 && <Chip label={option3} onDelete={() => setOption3(undefined)} />,
								search && <Chip label={`Search: ${search}`} onDelete={() => setSearch("")} />,
							]}
						>
							<CardContent>
								<Checkbox label="Filter Option 1" value={option1} onChange={setOption1} />
								<Checkbox label="Filter Option 2" value={option2} onChange={setOption2} />
								<Select
									label="Filter Option 3"
									value={option3}
									onChange={setOption3}
									options={["one", "two", "three", "four"]}
								/>
							</CardContent>
						</Filter>
					</DemoSource>
				</Box>
				<DemoControls>
					<Checkbox label="enableSearch" value={enableSearch} onChange={setEnableSearch} />
				</DemoControls>
			</Demo>
		</Box>
	);
}

const t = createSimpleTFunc({none: "No filter set", search: "Search", reset: "Reset"});
