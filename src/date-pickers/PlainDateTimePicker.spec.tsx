import {PlainDateTime} from "../temporal";
import {act, create, ReactTestRenderer} from "react-test-renderer";
import * as React from "react";
import {PlainDateTimePicker} from "./PlainDateTimePicker";

describe("PlainDateTimePicker", () => {

    test("render", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(
                <PlainDateTimePicker
                    locale="de"
                    value={new PlainDateTime(2022, 5, 30, 22, 33)}
                    onChange={() => {}}
                />);
        })
        const {value} = element!.root.findByType("input").props;
        expect(value).toBe("30.05.2022, 22:33");
    });

});