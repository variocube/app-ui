import * as React from "react";
import {createContext, PropsWithChildren, useCallback, useContext, useEffect, useState} from "react";
import Mustache from "mustache";
import {useStorage} from "./storage";
import {getNavigatorLanguages} from "./getNavigatorLanguages";

/**
 * Type for a message object (content of a translation file).
 */
export interface MessageObject {
    [key: string]: string | MessageObject;
}

/**
 * Localization context options
 */
export interface LocalizationContextOptions<T extends MessageObject> {
    /**
     * Loads the message object for the given language.
     *
     * This will typically dynamically import a JSON file containing the messages.
     * @param language The language to load
     */
    load: (language: string) => Promise<T>;

    /**
     * The fallback language to use, when the user's preferred languages cannot be loaded.
     */
    fallback: string;

    /**
     * A function that is called when a key could not be found.
     * Default: a function that prints a warning to the console and returns an empty string.
     * @param key The key that could not be found.
     */
    missing?: (key: string) => string;
}

/**
 * Sets the current language.
 */
type SetLanguageFunc = (language: string | null) => any;

/**
 * Returns the message associated with `key` in the current language.
 * Resolves placeholders with the values specified in `context`.
 */
type TFunc<T> = (key: Leaves<T>, context?: Record<string, any>) => string;

/**
 * Returns the value property `name` of the object associated with `key` in the current language.
 */
type EFunc<T> = (key: Branches<T>, name: string) => string;

/**
 * The object returned by `useLocalization`.
 */
export interface Localization<T extends MessageObject> {
    /**
     * Returns the message associated with `key` in the current language.
     * Resolves placeholders with the values specified in `context`.
     */
    t: TFunc<T>;

    /**
     * Returns the value property `name` of the object associated with `key` in the current language.
     */
    e: EFunc<T>;

    /**
     * Returns the currently used language.
     */
    language: string;

    /**
     * Sets the current language.
     */
    setLanguage: SetLanguageFunc;
}

interface LocalizationContextType<T extends MessageObject> {
    messages: T | undefined;
    language: string;
    setLanguage: SetLanguageFunc;
}

/**
 * The key in the browser's storage, where the user-selected language is stored.
 */
const LANGUAGE_STORAGE_KEY = "variocube-language";

/**
 * Creates a typed localization context.
 *
 * The language context is created within this function in order to enable correct typings on
 * the message object and the accessor functions.
 * @param options The options
 */
export function createLocalizationContext<T extends MessageObject>(options: LocalizationContextOptions<T>) {

    const {load, fallback, missing = defaultMissing} = options;

    /**
     * Returns a promise to the messages for the first language of the given list of languages
     * that could be successfully loaded.
     * @param languages The languages to try loading
     */
    const loadBestMatch = async (languages: (string | null)[]) => {
        for (const language of processLanguageList(languages)) {
            try {
                const messages = await load(language);
                if (messages) {
                    return {messages, language};
                }
            }
            catch (error) {
                // try next language
            }
        }
        throw new Error("Could not load any language. This is likely a configuration error.");
    }

    /**
     * The React context.
     */
    const LocalizationContext = createContext<LocalizationContextType<T>>({
        messages: undefined,
        language: fallback,
        setLanguage: () => void 0,
    });

    /**
     * Localization provider component.
     */
    const LocalizationProvider = ({children}: PropsWithChildren<{}>) => {

        // The user defined language, or null if user did not manually select a language
        const [userDefinedLanguage, setUserDefinedLanguage] = useStorage<string | null>(LANGUAGE_STORAGE_KEY, null);

        // The context value
        const [value, setValue] = useState<LocalizationContextType<T>>({
            messages: undefined,
            language: fallback,
            setLanguage: setUserDefinedLanguage,
        });

        // Loads the best matching language and updates the context value.
        useEffect(() => {
            loadBestMatch([userDefinedLanguage, ...getNavigatorLanguages(), fallback])
                .then(loaded => setValue(v => ({...v, ...loaded})))
                .catch(error => console.error(error));
        }, [userDefinedLanguage]);

        return (
            <LocalizationContext.Provider value={value}>
                {children}
            </LocalizationContext.Provider>
        );
    }

    /**
     * Returns accessors to the currently used language.
     */
    const useLocalization = () => {
        const value = useContext(LocalizationContext);
        if (!value) {
            throw new Error("Cannot find localization context. Are you missing a LocalizationProvider in your component tree?");
        }
        const {messages, language, setLanguage} = value;

        const t = useCallback((key: Leaves<T>, context?: Record<string, any>) => {
            if (messages) {
                const localized = getString(messages, key);
                if (localized) {
                    return Mustache.render(localized, context);
                }
                return missing(key);
            }
        }, [messages]);

        const e = useCallback((key: Branches<T>, name: string) => t(key + "." + name as Leaves<T>), [messages]);

        return {
            t,
            e,
            language,
            setLanguage
        } as Localization<T>;
    }

    return {
        LocalizationProvider,
        useLocalization,
    }
}

/**
 * Processes a list of languages:
 *  - Skips null or empty languages
 *  - Expands a language by adding additional entries for the language component of locale notations.
 * Example: an entry "en-US" turns into two entries "en-US" and "en".
 * @param languages
 */
function processLanguageList(languages: (string | null)[]) {
    const expanded = [];
    for (const language of languages) {
        if (language) {
            // push the original language, e.g. "en-US"
            expanded.push(language);
            // push the language only, e.g.
            const languageOnly = language.split("-").shift();
            if (languageOnly && languageOnly != language) {
                expanded.push(languageOnly);
            }
        }
    }
    // avoid duplicates
    return new Set(expanded);
}

/**
 * Default handler for missing keys.
 * @param key The missing key.
 */
function defaultMissing(key: string) {
    console.warn("Missing translation key", key);
    return "";
}

/*
 * Prepare for some heavy TypeScript shenanigans.
 * This actually enables type checking in the `t()` and `o()` functions.
 *
 * Inspired by:
 * https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object/58436959#58436959
 */

/**
 * Concatenates two strings with a dot in the middle, unless the last string is empty.
 * So Join<"a","b.c"> is "a.b.c" while Join<"a",""> is "a".
 */
type Join<K, P> = K extends string
    ? P extends string
        ? `${K}${"" extends P ? "" : "."}${P}`
        : never
    : never;

/**
 * Helper type for reduction the depth type param.
 */
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]];

/**
 * Our max depth.
 */
type MaxDepth = 5;

/**
 * Returns a union of all paths for a given type T
 */
type Paths<T, D extends number = MaxDepth> = [D] extends [never]
    ? never
    : T extends object
        ? {
            [K in keyof T]-?: K extends string | number
                ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
                : never
        }[keyof T]
        : "";

/**
 * Returns a union of all the leaf paths for a given type T
 */
type Leaves<T, D extends number = MaxDepth> = [D] extends [never]
    ? never
    : T extends object
        ? { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T]
        : "";

/**
 * Returns a union of all branch paths for a given type T
 */
type Branches<T> = Exclude<Paths<T>, Leaves<T>>;

function getString<T extends MessageObject>(obj: T, key: Leaves<T>) {
    return getKey(obj, key)?.toString();
}

function getKey<T extends MessageObject>(obj: T, key: string) {
    return key.split('.')
        .reduce((obj, key) => obj && obj[key] as any, obj) as any as (string | MessageObject | undefined);
}

