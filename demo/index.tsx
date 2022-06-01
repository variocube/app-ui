import * as React from "react";
import * as ReactDOM from "react-dom";
import {BrowserRouter, Link, Routes, Route} from "react-router-dom";
import {DevApp} from "./DevApp";
import {Localization} from "./localization";
import {Pickers} from "./date-pickers";

function Demo() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/">
                    <Route index element={<Start/>}/>
                    <Route path="localization" element={<Localization/>}/>
                    <Route path="date-pickers" element={<Pickers/>}/>
                    <Route path="devapp" element={<DevApp/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

function Start() {
    return (
        <ul>
            <li><Link to="/localization">Localization</Link></li>
            <li><Link to="/date-pickers">Date & time pickers</Link></li>
            <li><Link to="/devapp">Dev App</Link></li>
        </ul>
    )
}

ReactDOM.render(
    <Demo/>,
    document.getElementById("content")
);