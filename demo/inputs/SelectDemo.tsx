import {Apple} from "@mui/icons-material";
import {Box, Chip, Stack, Typography} from "@mui/material";
import React, {useState} from "react";
import {Code, createSimpleTFunc, Select} from "../../src";
import {Demo, DemoSource} from "../demo";

// @ts-ignore
import source from "./SelectDemo.tsx?source";

const fruits = ["banana", "orange", "apple"] as const;
type Fruit = typeof fruits[number];

// emulate an s-function
function s(_: "fruits") {
	return createSimpleTFunc({
		none: "None",
		apple: "Apple",
		orange: "Orange",
		banana: "Banana",
	});
}

export function SelectDemo() {
	const [value, setValue] = useState<Fruit>();
	const [value2, setValue2] = useState<"none" | Fruit>();
	return (
		<Box>
			<Typography variant="h2" gutterBottom>
				<Code>Select</Code>
			</Typography>
			<Typography variant="subtitle1" gutterBottom>
				Alternative to Mui <Code>Select</Code> using a <Code>TextField</Code>.
			</Typography>
			<Demo source={source} id="select">
				<Stack spacing={2} p={2}>
					<DemoSource for="#select">
						<Select
							label="Your favorite fruit"
							value={value}
							onChange={setValue}
							options={fruits}
							renderLabel={s("fruits")}
						/>
						<Select
							label="Custom Labels"
							value={value2}
							onChange={setValue2}
							options={["none", ...fruits]}
							renderLabel={option => ({
								none: "I don't like fruits",
								apple: <Chip label="Apple" icon={<Apple />} />,
								banana: "🍌",
								orange: "Orange",
							}[option])}
						/>
					</DemoSource>
				</Stack>
			</Demo>
		</Box>
	);
}
