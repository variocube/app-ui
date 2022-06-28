import {act, create, ReactTestRenderer} from "react-test-renderer";
import * as React from "react";
import {Instant, PlainDate, PlainDateTime, PlainTime, ZonedDateTime} from "../temporal";
import {TemporalFormat} from "./TemporalFormat";

describe("TemporalFormat", () => {

    // set and restore timezone
    let oldTimezone: string | undefined;
    beforeAll(() => {
        oldTimezone = process.env.TZ;
        process.env.TZ = "Europe/Vienna";
    });
    afterAll(() => {
        process.env.TZ = oldTimezone;
    });

    test("PlainDate de-AT", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(<TemporalFormat value={PlainDate.from("2022-06-22")} locale="de-AT"/>);
        });
        const value = element!.root.children[0];
        expect(value).toBe("22.6.2022");
    });

    test("PlainDate en-US", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(<TemporalFormat value={PlainDate.from("2022-06-22")} locale="en-US"/>);
        });
        const value = element!.root.children[0];
        expect(value).toBe("6/22/2022");
    });

    test("PlainDateTime de-AT", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(<TemporalFormat value={PlainDateTime.from("2022-06-22T14:22")} locale="de-AT"/>);
        });
        const value = element!.root.children[0];
        expect(value).toBe("22.6.2022, 14:22:00");
    });

    test("PlainDateTime en-US", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(<TemporalFormat value={PlainDateTime.from("2022-06-22T14:22")} locale="en-US"/>);
        });
        const value = element!.root.children[0];
        expect(value).toBe("6/22/2022, 2:22:00 PM");
    });

    test("PlainTime de-AT", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(<TemporalFormat value={PlainTime.from({hour: 14, minute: 22})} locale="de-AT"/>);
        });
        const value = element!.root.children[0];
        expect(value).toBe("14:22:00");
    });

    test("PlainTime en-US", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(<TemporalFormat value={PlainTime.from({hour: 14, minute: 22})} locale="en-US"/>);
        });
        const value = element!.root.children[0];
        expect(value).toBe("2:22:00 PM");
    });

    test("ZonedDateTime de-AT", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(<TemporalFormat value={ZonedDateTime.from("2022-06-22T14:22[MET]")} locale="de-AT" />);
        })
        const value = element!.root.children[0];
        expect(value).toBe("22.6.2022, 14:22:00 GMT+2");
    });

    test("ZonedDateTime en-US", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(<TemporalFormat value={ZonedDateTime.from("2022-06-22T14:22[MET]")} locale="en-US" />);
        })
        const value = element!.root.children[0];
        expect(value).toBe("6/22/2022, 2:22:00 PM GMT+2");
    });

    test("Instant de-AT", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(<TemporalFormat value={Instant.from("2022-06-22T14:22:11Z")} locale="de-AT" />);
        })
        const value = element!.root.children[0];
        expect(value).toBe("22.6.2022, 16:22:11");
    });

    test("Instant en-US", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(<TemporalFormat value={Instant.from("2022-06-22T14:22:11Z")} locale="en-US" />);
        })
        const value = element!.root.children[0];
        expect(value).toBe("6/22/2022, 4:22:11 PM");
    });

});