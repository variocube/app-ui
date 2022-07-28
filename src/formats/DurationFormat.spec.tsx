import {act, create, ReactTestRenderer} from "react-test-renderer";
import * as React from "react";
import {DurationFormat} from "./DurationFormat";
import {Duration} from "../temporal";

describe("DurationFormat", () => {

    test("render de-AT", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(<DurationFormat value={Duration.from({days: 5, hours: 2, seconds: 2})} locale="de-AT" />);
        })
        const value = element!.root.children[0];
        expect(value).toBe("5d 02:00:02");
    });

    test("render en-US", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(<DurationFormat value={Duration.from({days: 5, hours: 2, seconds: 2})} locale="en-US" />);
        })
        const value = element!.root.children[0];
        expect(value).toBe("5d 02:00:02");
    });

});