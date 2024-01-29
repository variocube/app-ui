import React, {createContext, PropsWithChildren, useContext, useState} from "react";
import {Helmet} from "react-helmet";

interface LayoutContextType {
    setAppName: (appName: string) => void;
    setPageTitle: (name: string) => void;
    setMeta: (meta: Record<string, string>) => void;
    appName?: string;
    pageTitle?: string;
    meta?: Record<string, string>;
}

const LayoutContext = createContext<LayoutContextType>({
    setAppName: () => void 0,
    setPageTitle: () => void 0,
    setMeta: () => void 0,
});

interface LayoutProviderProps {
    appName: string
}

export function LayoutProvider({appName: pAppName, children}: PropsWithChildren<LayoutProviderProps>) {

    const [appName, setAppName] = useState<string>(pAppName);
    const [pageTitle, setPageTitle] = useState<string>();
    const [meta, setMeta] = useState<Record<string, string>>();

    return (
        <LayoutContext.Provider value={{
            appName, setAppName,
            pageTitle, setPageTitle,
            meta, setMeta
        }}>
            <Helmet>
                <title>{pageTitle ?? appName}</title>
                {meta && Object.entries(meta)
                    .map(([name, content]) => (
                        <meta key={name} {...{name, content}} />
                    ))
                }
            </Helmet>
            {children}
        </LayoutContext.Provider>
    )
}

export const useLayoutContext = () => {
    const value = useContext(LayoutContext);
    if (!value) {
        throw new Error('Cannot find layout context. Are you missing a LayoutProvider in your component tree?');
    }
    const {setAppName, setPageTitle, setMeta} = value;
    return {
        setAppName, setPageTitle, setMeta
    }
}