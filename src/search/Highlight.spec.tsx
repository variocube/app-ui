import * as React from "react";
import {create} from "react-test-renderer";
import {Highlight} from "./Highlight";

describe("Highlight", () => {
	test("renders nothing for empty text", () => {
		const renderer = create(<Highlight text="" highlight="foo" />);
		expect(renderer.toJSON()).toBeNull();
	});

	test("renders plain text without highlight", () => {
		const renderer = create(<Highlight text="hello world" />);
		const spans = renderer.root.findAllByType("span");
		expect(spans).toHaveLength(1);
		expect(spans[0].props.style.fontWeight).toBe(400);
		expect(spans[0].props.children).toBe("hello world");
	});

	test("renders matching part in bold", () => {
		const renderer = create(<Highlight text="hello world" highlight="world" />);
		const spans = renderer.root.findAllByType("span");
		expect(spans).toHaveLength(2);
		expect(spans[0].props.children).toBe("hello ");
		expect(spans[0].props.style.fontWeight).toBe(400);
		expect(spans[1].props.children).toBe("world");
		expect(spans[1].props.style.fontWeight).toBe(700);
	});
});
