import * as React from "react";
import {
    createContext,
    Fragment,
    PropsWithChildren,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
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
    dialogTitle?: string;
    dialogContent?: ReactNode;
}

export function HelpSettingsContextProvider({baseUrl,localStorageVar, changeLogUrl, currentVersion, dialogTitle, dialogContent, children}: PropsWithChildren<HelpSettingsContextProviderProps>) {
    const [selectedHelpPage, setSelectedHelpPage] = useState<string | undefined>();
    const [selectedHelpAnchor, setSelectedHelpAnchor] = useState<string | undefined>();
    const [selectedHelpLanguage, setSelectedHelpLanguage] = useState<string | undefined>();

    const handleSetSelectedHelpPage = useCallback((helpPage: string) => {
        setSelectedHelpPage(helpPage);
    }, []);

    const [openDialog, setOpenDialog] = useState<boolean>(false);

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
        if(changeLogUrl && localStorageVar && currentVersion){
            const lastSeenVersion = localStorage.getItem(localStorageVar);
            if(lastSeenVersion && semver.lt(lastSeenVersion, currentVersion)){
                setOpenDialog(true);
            }else{
                localStorage.setItem(localStorageVar, currentVersion);
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
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
            <DialogTitle>
                {dialogTitle}
            </DialogTitle>

            {dialogContent}

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