import {PlainDate} from "../temporal";
import {PlainDatePicker} from "./PlainDatePicker";
import {act, create, ReactTestRenderer} from "react-test-renderer";
import * as React from "react";

describe("PlainDatePicker", () => {

    test("render", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(
                <PlainDatePicker
                    locale="de"
                    value={new PlainDate(2022, 5, 30)}
                    onChange={() => {}}
                />);
        })
        const {value} = element!.root.findByType("input").props;
        expect(value).toBe("30.05.2022");
    });

});