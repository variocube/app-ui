import * as React from "react";
import {createContext, PropsWithChildren, useCallback, useContext, useMemo, useState} from "react";

interface HelpSettingsContextData {
    baseUrl: string;
    selectedHelpKey?: string;
    setSelectedHelpKey: (key: string) => void;
    clearSelectedHelpKey: () => void;
}

const emptyContext: HelpSettingsContextData = {
    baseUrl: "",
    setSelectedHelpKey: (key: string) => console.error(`Empty context should not call setSelectedHelpKey(${key}), you most likely do not have <HelpSettingsContextProvider/> in your component tree.`),
    clearSelectedHelpKey: () => console.error(`Empty context should not call clearSelectedHelpKey(), you most likely do not have <HelpSettingsContextProvider/> in your component tree.`)
};

const HelpSettingsContext = createContext(emptyContext);

interface HelpSettingsContextProviderProps {
    baseUrl: string;
}

export function HelpSettingsContextProvider({baseUrl, children}: PropsWithChildren<HelpSettingsContextProviderProps>) {
    const [selectedHelpKey, setSelectedHelpKey] = useState<string | undefined>();

    const handleSetSelectedHelpKey = useCallback((helpKey: string) => {
        setSelectedHelpKey(helpKey);
    }, []);

    const clearSelectedHelpKey = useCallback(() => {
        setSelectedHelpKey(undefined);
    }, []);

    const defaultContext = useMemo<HelpSettingsContextData>(() => ({
        baseUrl, selectedHelpKey, setSelectedHelpKey: handleSetSelectedHelpKey, clearSelectedHelpKey
    }), [baseUrl, selectedHelpKey, handleSetSelectedHelpKey, clearSelectedHelpKey]);

    return (
        <HelpSettingsContext.Provider value={defaultContext}>
            {children}
        </HelpSettingsContext.Provider>
    );
}

export function useHelpSettingsContext(): HelpSettingsContextData {
    return useContext<HelpSettingsContextData>(HelpSettingsContext);
}