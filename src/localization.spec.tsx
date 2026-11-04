/**
 * @jest-environment jsdom
 */

import * as React from "react";
import {act, create, ReactTestRenderer} from "react-test-renderer";
import {createLocalizationContext} from "./localization";

interface Messages {
	[key: string]: string;
	greeting: string;
}

const MESSAGES: Record<string, Messages> = {
	de: {greeting: "Hallo"},
	en: {greeting: "Hello"},
	fr: {greeting: "Bonjour"},
};

/** A load call the test settles by hand. */
interface Load {
	language: string;
	resolve: () => void;
	reject: () => void;
}

/** A localization whose loads wait until the test settles them; `en-US` has no messages and fails at once. */
function heldLocalization() {
	const loads: Load[] = [];
	const {LocalizationProvider, useLocalization} = createLocalizationContext<Messages>({
		load: language =>
			language === "en-US"
				? Promise.reject(new Error("No messages"))
				: new Promise<Messages>((resolve, reject) =>
					loads.push({
						language,
						resolve: () => resolve(MESSAGES[language]),
						reject: () => reject(new Error("Network error")),
					})
				),
		fallback: "en",
		missing: key => key,
	});
	const Greeting = () => {
		const {t, language} = useLocalization();
		return <span data-language={language}>{t("greeting")}</span>;
	};
	const render = (language: string) => (
		<LocalizationProvider language={language} onChangeLanguage={() => void 0}>
			<Greeting />
		</LocalizationProvider>
	);
	/** The pending load of the language. */
	const load = (language: string) => {
		const found = loads.find(load => load.language === language);
		if (!found) {
			throw new Error(`No load of ${language}`);
		}
		return found;
	};
	return {render, load};
}

/** Settles a load and lets the provider apply whatever follows from it. */
async function settle(outcome: () => void) {
	await act(async () => {
		outcome();
		await new Promise(resolve => setTimeout(resolve, 0));
	});
}

function shown(renderer: ReactTestRenderer) {
	const span = renderer.root.findByType("span");
	return {text: span.children.join(""), language: span.props["data-language"]};
}

describe("LocalizationProvider", () => {
	afterEach(() => document.documentElement.removeAttribute("lang"));

	// jsdom's navigator prefers `en-US`, so the candidates for a language L are L, `en-US`, `en`.
	test("a slow load of an earlier language never replaces a later one", async () => {
		const {render, load} = heldLocalization();
		let renderer: ReactTestRenderer;
		act(() => {
			renderer = create(render("de"));
		});
		act(() => renderer.update(render("fr")));
		await settle(load("fr").resolve);
		expect(shown(renderer!)).toEqual({text: "Bonjour", language: "fr"});
		expect(document.documentElement.lang).toBe("fr");

		await settle(load("de").resolve);
		expect(shown(renderer!)).toEqual({text: "Bonjour", language: "fr"});
		expect(document.documentElement.lang).toBe("fr");
	});

	test("a failed load's next candidate never replaces a later language", async () => {
		const {render, load} = heldLocalization();
		let renderer: ReactTestRenderer;
		act(() => {
			renderer = create(render("de"));
		});
		act(() => renderer.update(render("fr")));
		// German fails; the provider goes on to `en-US` (refused) and `en`, which is still loading.
		await settle(load("de").reject);
		await settle(load("fr").resolve);
		expect(shown(renderer!)).toEqual({text: "Bonjour", language: "fr"});

		await settle(load("en").resolve);
		expect(shown(renderer!)).toEqual({text: "Bonjour", language: "fr"});
		expect(document.documentElement.lang).toBe("fr");
	});
});
