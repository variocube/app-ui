import {Box, Stack, Typography} from "@mui/material";
import React, {useState} from "react";
import {Code, UrlUploadField} from "../../src";
import {Demo, DemoSource} from "../demo";

// @ts-ignore
import source from "./UrlUploadDemo.tsx?source";

// emulate an upload
function upload(file: File) {
	return new Promise<string>((resolve) => {
		setTimeout(() => {
			if (file.type.startsWith("image/")) {
				resolve("https://placehold.co/600x400");
			} else {
				resolve("https://www.variocube.com/");
			}
		}, 500);
	});
}

export function UrlUploadDemo() {
	const [value, setValue] = useState(
		"https://www.variocube.com/wp-content/uploads/2019/11/VC_LOGO_RGB_Main_160x43.png",
	);
	return (
		<Box>
			<Typography variant="h2" gutterBottom>
				<Code>UrlUploadField</Code>
			</Typography>
			<Typography variant="subtitle1" gutterBottom>
				A text field for entering a URL, that allows to upload a file.
			</Typography>
			<Demo source={source} id="file-upload-field">
				<Stack spacing={2} p={2}>
					<DemoSource for="#file-upload-field">
						<UrlUploadField
							value={value}
							onChange={setValue}
							label="Your URL"
							upload={upload}
						/>
					</DemoSource>
				</Stack>
			</Demo>
		</Box>
	);
}
