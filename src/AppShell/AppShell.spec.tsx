/**
 * @jest-environment jsdom
 */

import {createTheme, ThemeProvider} from "@mui/material";
import * as React from "react";
import {unmountComponentAtNode} from "react-dom";
import {render} from "react-dom";
import {act} from "react-dom/test-utils";
import {AppShell} from "./AppShell";

// Jest cannot load the font files the font components import.
jest.mock("../VCThemeProvider/JetbrainsMonoFont", () => ({JetbrainsMonoFont: () => null}));
jest.mock("../VCThemeProvider/RobotoFont", () => ({RobotoFont: () => null}));

const THEME = createTheme({palette: {background: {default: "#102030", paper: "#405060"}}});
const VARIOCUBE_LOGO = "svg[viewBox=\"0 0 74 86\"]";

describe("AppShell", () => {
	let container: HTMLDivElement;

	beforeEach(() => {
		container = document.createElement("div");
		document.body.appendChild(container);
	});

	afterEach(() => {
		act(() => {
			unmountComponentAtNode(container);
		});
		container.remove();
	});

	function renderShell(props: Partial<React.ComponentProps<typeof AppShell>> = {}) {
		act(() => {
			render(
				<ThemeProvider theme={THEME}>
					<AppShell appName="Test" {...props}>content</AppShell>
				</ThemeProvider>,
				container,
			);
		});
	}

	function bar() {
		return container.querySelector("header") as HTMLElement;
	}

	test("without the new props the bar shows the Variocube logo on the theme's paper colour", () => {
		renderShell();
		expect(bar().querySelector(VARIOCUBE_LOGO)).not.toBeNull();
		expect(getComputedStyle(bar()).backgroundColor).toBe("rgb(64, 80, 96)");
	});

	test("a logo replaces the Variocube logo", () => {
		renderShell({logo: <img alt="Tenant" src="https://example.com/logo.svg" />});
		expect(bar().querySelector(VARIOCUBE_LOGO)).toBeNull();
		expect(bar().querySelector("img[alt=Tenant]")).not.toBeNull();
	});

	test.each([["a palette path", "background.default", "rgb(16, 32, 48)"], ["a colour", "#ff0000", "rgb(255, 0, 0)"]])(
		"barBackground as %s reaches the bar",
		(_, barBackground, expected) => {
			renderShell({barBackground});
			expect(getComputedStyle(bar()).backgroundColor).toBe(expected);
		},
	);
});
