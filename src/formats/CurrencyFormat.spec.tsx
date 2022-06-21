import {act, create, ReactTestRenderer} from "react-test-renderer";
import * as React from "react";
import {CurrencyFormat} from "./CurrencyFormat";

describe("CurrencyFormat", () => {

    test("render de-AT", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(<CurrencyFormat value={1234.5} currency="EUR" locale="de-AT" />);
        })
        const value = element!.root.children[0];
        expect(value).toBe("€\u00a01.234,50"); // \u00a0 is a non-breaking space
    });

    test("render en-US", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(<CurrencyFormat value={1234.5} currency="USD" locale="en-US" />);
        })
        const value = element!.root.children[0];
        expect(value).toBe("$1,234.50");
    });

});