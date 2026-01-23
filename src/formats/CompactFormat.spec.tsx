import * as React from "react";
import {act, create, ReactTestRenderer} from "react-test-renderer";
import {CompactFormat} from "./CompactFormat";

describe("CompactFormat", () => {
	test("render de-AT", () => {
		let element: ReactTestRenderer;
		act(() => {
			element = create(<CompactFormat value={99000000} locale="de-AT" />);
		});
		const value = element!.root.children[0];
		expect(value).toBe("99\u00a0Mio.");
	});

	test("render en-US", () => {
		let element: ReactTestRenderer;
		act(() => {
			element = create(<CompactFormat value={99000000} locale="en-US" />);
		});
		const value = element!.root.children[0];
		expect(value).toBe("99M");
	});
});
