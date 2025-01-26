import React, {createContext, PropsWithChildren, useContext, useEffect, useMemo, useState} from "react";

interface LayoutContextType {
	setPageTitle: (name?: string) => void;
}

const LayoutContext = createContext<LayoutContextType>({
	setPageTitle: () => void 0,
});

interface LayoutProviderProps {
	appName: string;
}

export function LayoutProvider({appName, children}: PropsWithChildren<LayoutProviderProps>) {
	const [pageTitle, setPageTitle] = useState<string>();

	useEffect(() => {
		document.title = pageTitle ? `${pageTitle} | ${appName}` : appName;
	}, [pageTitle]);

	const value = useMemo(() => ({setPageTitle}), []);

	return (
		<LayoutContext.Provider value={value}>
			{children}
		</LayoutContext.Provider>
	);
}

export const useLayoutContext = () => {
	const value = useContext(LayoutContext);
	if (!value) {
		throw new Error("Cannot find layout context. Are you missing a LayoutProvider in your component tree?");
	}
	const {setPageTitle} = value;
	return {
		setPageTitle,
	};
};
