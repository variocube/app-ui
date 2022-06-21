import {act, create, ReactTestRenderer} from "react-test-renderer";
import * as React from "react";
import {DecimalFormat} from "./DecimalFormat";

describe("DecimalFormat", () => {

    test("render de-AT", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(<DecimalFormat value={1234.5} locale="de-AT" />);
        })
        const value = element!.root.children[0];
        expect(value).toBe("1\u00a0234,5");
    });

    test("render en-US", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(<DecimalFormat value={1234.5} locale="en-US" />);
        })
        const value = element!.root.children[0];
        expect(value).toBe("1,234.5");
    });

});