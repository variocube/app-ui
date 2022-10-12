import React, {FunctionComponentElement} from "react";
import ReactDOM from "react-dom";

export function render(element: FunctionComponentElement<any> | Array<FunctionComponentElement<any>>) {
    try {
        ReactDOM.render(element, document.querySelector("#react-root"), removeSplash);
    }
    catch (error) {
        // show the error using the class defined in the template
        // this can obviously be improved
        ReactDOM.render((
            <div className="splash-error">
                <h1>Failed to load application</h1>
                <p>
                    An error occurred while loading the application.
                    Please make sure you are using a current browser version.
                </p>
            </div>
        ), document.body);
    }
}

export async function removeSplash() {
    // wait for fonts to become ready
    if (document.fonts) {
        await document.fonts.ready;
    }

    const preloader = document.querySelector("#splash");
    if (preloader) {
        preloader.classList.add("fadeout");
        setTimeout(() => preloader.parentNode?.removeChild(preloader), 500);
    }
}
