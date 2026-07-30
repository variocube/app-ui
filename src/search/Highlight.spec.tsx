import {createTheme, ThemeProvider} from "@mui/material";
import * as React from "react";
import {create} from "react-test-renderer";
import {Highlight} from "./Highlight";

describe("Highlight", () => {
	test("renders nothing for empty text", () => {
		const renderer = create(<Highlight text="" highlight="foo" />);
		expect(renderer.toJSON()).toBeNull();
	});

	test("renders plain text without wrapping it in an element", () => {
		const renderer = create(<Highlight text="hello world" />);
		expect(renderer.root.findAllByType("span")).toHaveLength(0);
		expect(renderer.toJSON()).toBe("hello world");
	});

	test("renders only the matching part in a bold element", () => {
		const renderer = create(<Highlight text="hello world" highlight="world" />);
		const spans = renderer.root.findAllByType("span");
		expect(spans).toHaveLength(1);
		expect(spans[0].props.children).toBe("world");
		expect(spans[0].props.style.fontWeight).toBe(700);
	});

	test("takes the bold weight from the theme", () => {
		const renderer = create(
			<ThemeProvider theme={createTheme({typography: {fontWeightBold: 600}})}>
				<Highlight text="hello world" highlight="world" />
			</ThemeProvider>,
		);
		expect(renderer.root.findAllByType("span")[0].props.style.fontWeight).toBe(600);
	});
});
