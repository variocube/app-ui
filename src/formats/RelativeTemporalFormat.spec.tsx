import {act, create, ReactTestRenderer} from "react-test-renderer";
import * as React from "react";
import {Now} from "../temporal";
import {RelativeTemporalFormat} from "./RelativeTemporalFormat";

describe("RelativeTemporalFormat", () => {

    test("plainDate de-AT", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(<RelativeTemporalFormat value={Now.plainDateISO().subtract({days: 1})} locale="de-AT"/>);
        });
        const value = element!.root.children[0];
        expect(value).toBe("vor 1 Tag");
    });

    test("plainDate en-US", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(<RelativeTemporalFormat value={Now.plainDateISO().subtract({days: 1})} locale="en-US"/>);
        });
        const value = element!.root.children[0];
        expect(value).toBe("1 day ago");
    });

    // TODO: Does not round correctly on Node, but works in browser
    test.skip("plainDateTime de-AT", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(<RelativeTemporalFormat value={Now.plainDateTimeISO().add({hours: 3})} locale="de-AT"/>);
        });
        const value = element!.root.children[0];
        expect(value).toBe("in 3 Stunden");
    });

    // TODO: Does not round correctly on Node, but works in browser
    test.skip("plainDateTime en-US", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(<RelativeTemporalFormat value={Now.plainDateTimeISO().add({hours: 3})} locale="en-US"/>);
        });
        const value = element!.root.children[0];
        expect(value).toBe("in 3 hours");
    });

    // TODO: Does not round correctly on Node, but works in browser
    test.skip("zonedDateTime de-AT", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(<RelativeTemporalFormat value={Now.zonedDateTimeISO().add({hours: 3})} locale="de-AT"/>);
        });
        const value = element!.root.children[0];
        expect(value).toBe("in 3 Stunden");
    });

    // TODO: Does not round correctly on Node, but works in browser
    test.skip("zonedDateTime en-US", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(<RelativeTemporalFormat value={Now.zonedDateTimeISO().add({hours: 3})} locale="en-US"/>);
        });
        const value = element!.root.children[0];
        expect(value).toBe("in 3 hours");
    });

    // TODO: Does not round correctly on Node, but works in browser
    test.skip("instant de-AT", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(<RelativeTemporalFormat value={Now.instant().add({hours: 3})} locale="de-AT"/>);
        });
        const value = element!.root.children[0];
        expect(value).toBe("in 3 Stunden");
    });

    // TODO: Does not round correctly on Node, but works in browser
    test.skip("instant en-US", () => {
        let element: ReactTestRenderer;
        act(() => {
            element = create(<RelativeTemporalFormat value={Now.instant().add({hours: 3})} locale="en-US"/>);
        });
        const value = element!.root.children[0];
        expect(value).toBe("in 3 hours");
    });
});