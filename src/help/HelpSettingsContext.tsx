import * as React from "react";
import {createContext, PropsWithChildren, useCallback, useContext, useMemo, useState} from "react";

interface HelpSettingsContextData {
    baseUrl: string;
    selectedHelpPage?: string;
    setSelectedHelpPage: (page: string) => void;
    clearSelectedHelpPage: () => void;
    selectedHelpAnchor?: string;
    setSelectedHelpAnchor: (anchor: string) => void;
    clearSelectedHelpAnchor: () => void;

    selectedHelpLanguage?: string;
    setSelectedHelpLanguage: (language: string) => void;
    clearSelectedHelpLanguage: () => void;

}

const emptyContext: HelpSettingsContextData = {
    baseUrl: "",
    setSelectedHelpPage: (page: string) => console.error(`Empty context should not call setSelectedHelpPage(${page}), you most likely do not have <HelpSettingsContextProvider/> in your component tree.`),
    clearSelectedHelpPage: () => console.error(`Empty context should not call clearSelectedHelpPage(), you most likely do not have <HelpSettingsContextProvider/> in your component tree.`),
    setSelectedHelpAnchor: (anchor: string) => console.error(`Empty context should not call setSelectedHelpAnchor(${anchor}), you most likely do not have <HelpSettingsContextProvider/> in your component tree.`),
    clearSelectedHelpAnchor: () => console.error(`Empty context should not call clearSelectedHelpAnchor(), you most likely do not have <HelpSettingsContextProvider/> in your component tree.`),
    setSelectedHelpLanguage: (language: string) => console.error(`Empty context should not call setSelectedHelpLanguage(${language}), you most likely do not have <HelpSettingsContextProvider/> in your component tree.`),
    clearSelectedHelpLanguage: () => console.error(`Empty context should not call clearSelectedHelpLanguage(), you most likely do not have <HelpSettingsContextProvider/> in your component tree.`),

};

const HelpSettingsContext = createContext(emptyContext);

interface HelpSettingsContextProviderProps {
    baseUrl: string;
}

export function HelpSettingsContextProvider({baseUrl, children}: PropsWithChildren<HelpSettingsContextProviderProps>) {
    const [selectedHelpPage, setSelectedHelpPage] = useState<string | undefined>();
    const [selectedHelpAnchor, setSelectedHelpAnchor] = useState<string | undefined>();
    const [selectedHelpLanguage, setSelectedHelpLanguage] = useState<string | undefined>();

    const handleSetSelectedHelpPage = useCallback((helpPage: string) => {
        setSelectedHelpPage(helpPage);
    }, []);

    const clearSelectedHelpPage = useCallback(() => {
        setSelectedHelpPage(undefined);
    }, []);

    const handleSetSelectedHelpAnchor = useCallback((helpAnchor: string) => {
        console.log("bamchi", helpAnchor);
        setSelectedHelpAnchor(helpAnchor);
    }, []);

    const clearSelectedHelpAnchor = useCallback(() => {
        setSelectedHelpAnchor(undefined);
    }, []);

    const handleSetSelectedHelpLanguage = useCallback((helpLanguage: string) => {
        setSelectedHelpLanguage(helpLanguage);
    }, []);

    const clearSelectedHelpLanguage = useCallback(() => {
        setSelectedHelpLanguage(undefined);
    }, []);

    const defaultContext = useMemo<HelpSettingsContextData>(() => ({
        baseUrl, 
        selectedHelpPage: selectedHelpPage, setSelectedHelpPage: handleSetSelectedHelpPage, clearSelectedHelpPage: clearSelectedHelpPage,
        selectedHelpAnchor: selectedHelpAnchor ,setSelectedHelpAnchor: handleSetSelectedHelpAnchor, clearSelectedHelpAnchor: clearSelectedHelpAnchor,
        selectedHelpLanguage: selectedHelpLanguage, setSelectedHelpLanguage: handleSetSelectedHelpLanguage, clearSelectedHelpLanguage: clearSelectedHelpLanguage,
    }), [baseUrl, 
        selectedHelpPage, handleSetSelectedHelpPage, clearSelectedHelpPage,
        selectedHelpAnchor, handleSetSelectedHelpAnchor, clearSelectedHelpAnchor,
        selectedHelpLanguage, handleSetSelectedHelpLanguage,clearSelectedHelpLanguage
    ]);

    return (
        <HelpSettingsContext.Provider value={defaultContext}>
            {children}
        </HelpSettingsContext.Provider>
    );
}

export function useHelpSettingsContext(): HelpSettingsContextData {
    return useContext<HelpSettingsContextData>(HelpSettingsContext);
}