import * as React from "react";
import {createContext, Fragment, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {Button, Dialog, DialogActions, DialogTitle, Link} from "@mui/material";
const semver = require('semver')

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
    localStorageVar?: string;
    changeLogUrl?: string;
    currentVersion?: string;
}

export function HelpSettingsContextProvider({baseUrl,localStorageVar, changeLogUrl, currentVersion, children}: PropsWithChildren<HelpSettingsContextProviderProps>) {
    const [selectedHelpPage, setSelectedHelpPage] = useState<string | undefined>();
    const [selectedHelpAnchor, setSelectedHelpAnchor] = useState<string | undefined>();
    const [selectedHelpLanguage, setSelectedHelpLanguage] = useState<string | undefined>();

    const handleSetSelectedHelpPage = useCallback((helpPage: string) => {
        setSelectedHelpPage(helpPage);
    }, []);

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [showDetailedDialog, setShowDetailedDialog] = useState<boolean>(false);

    const clearSelectedHelpPage = useCallback(() => {
        setSelectedHelpPage(undefined);
    }, []);

    const handleSetSelectedHelpAnchor = useCallback((helpAnchor: string) => {
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

    useEffect( () => {
        if(changeLogUrl && localStorageVar){
            if(localStorage.getItem(localStorageVar)){
                if(semver.lt(localStorage.getItem(localStorageVar), currentVersion)){
                    setShowDetailedDialog(true);
                    setOpenDialog(true);
                }
            }else{
                // Show Dialog with general info
                setShowDetailedDialog(false);
                setOpenDialog(true);
            }
        }
    }, []);

    function handleOk() {
        if(localStorageVar && currentVersion){
            localStorage.setItem(localStorageVar, currentVersion);
        }
        setOpenDialog(false);
    }

    return (
        <Fragment>
        <HelpSettingsContext.Provider value={defaultContext}>
            {children}
        </HelpSettingsContext.Provider>
        <Dialog open={openDialog}>
            <DialogTitle>
                {showDetailedDialog &&
                  <div>
                    This is a newer Version of the application ({currentVersion}). The last version you used was {localStorage.getItem(localStorageVar ? localStorageVar : "")}. Please go to the to <Link href={changeLogUrl ? changeLogUrl : ""} target="_blank">Change Log Page</Link> see the last updates.
                  </div>
                }
                {!showDetailedDialog &&
                  <div>
                    You can find the Change Log for this application here: <Link href={changeLogUrl ? changeLogUrl : ""} target="_blank">Go to Change Log</Link>
                  </div>
                }
            </DialogTitle>
            <DialogActions>
                <Button variant="outlined" onClick={handleOk}>OK</Button>
            </DialogActions>
        </Dialog>
        </Fragment>
    );
}

export function useHelpSettingsContext(): HelpSettingsContextData {
    return useContext<HelpSettingsContextData>(HelpSettingsContext);
}