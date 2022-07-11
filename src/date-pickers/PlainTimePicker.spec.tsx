import {PlainTime} from "../temporal";
import {act, create, ReactTestRenderer} from "react-test-renderer";
import * as React from "react";
import {PlainTimePicker} from "./PlainTimePicker";

describe("PlainTimePicker", () => {

    test("render", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(
                <PlainTimePicker
                    locale="de"
                    value={new PlainTime(22, 33)}
                    onChange={() => {}}
                />);
        })
        const {value} = element!.root.findByType("input").props;
        expect(value).toBe("22:33");
    });

});