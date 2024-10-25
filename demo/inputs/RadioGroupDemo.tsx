import {Apple} from "@mui/icons-material";
import {Box, Chip, Stack, Typography} from "@mui/material";
import React, {useState} from "react";
import {Checkbox, Code, createSimpleTFunc, RadioGroup} from "../../src";
import {Demo, DemoControls, DemoSource} from "../demo";

// @ts-ignore
import source from "./RadioGroupDemo.tsx?source";

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

export function RadioGroupDemo() {
	const [value, setValue] = useState<Fruit>();
	const [value2, setValue2] = useState<"none" | Fruit>();
	const [row, setRow] = useState(false);
	return (
		<Box>
			<Typography variant="h2" gutterBottom>
				<Code>RadioGroup</Code>
			</Typography>
			<Typography variant="subtitle1" gutterBottom>
				Simplifies handling a Mui <Code>RadioGroup</Code>.
			</Typography>
			<Demo source={source} id="radio-group">
				<Stack spacing={2} direction={row ? "column" : "row"} p={2}>
					<DemoSource for="#radio-group">
						<RadioGroup
							label="Your favorite fruit"
							value={value}
							onChange={setValue}
							row={row}
							options={fruits}
							renderLabel={s("fruits")}
						/>
						<RadioGroup
							label="Custom Labels"
							value={value2}
							onChange={setValue2}
							row={row}
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
				<DemoControls>
					<Checkbox label="row" value={row} onChange={setRow} />
				</DemoControls>
			</Demo>
		</Box>
	);
}