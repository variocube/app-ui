import * as React from "react";
import {
    createContext,
    createElement,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import {Breakpoint} from "@mui/system";

type ContainerWidth = Breakpoint | 'max';

const availableWidths: ContainerWidth[] = [ 'lg', 'xl', 'max'];

export function nextWidth(currentWidth: ContainerWidth): ContainerWidth {
    const currentIndex = availableWidths.indexOf(currentWidth);
    const nextIndex = currentIndex + 1;
    return nextIndex >= availableWidths.length ? availableWidths[0] : availableWidths[nextIndex];
}

export function containerWidthToBreakPoint(width: ContainerWidth): Breakpoint | false {
    return width === 'max' ? false : width;
}

const WIDTH_KEY = "variocube-container-width";
const DEFAULT_WIDTH: ContainerWidth = 'lg';

interface ContainerSettingsContextData {
    width: ContainerWidth;
    setWidth: (width: ContainerWidth) => void;
}

const emptyContext: ContainerSettingsContextData = {
    width: DEFAULT_WIDTH,
    setWidth: (width: ContainerWidth) => console.error(`Empty context should not call setWidth(${width}), you most likely do not have <ContainerSettingsContextProvider/> in your component tree.`)
};

const ContainerSettingsContext = createContext(emptyContext);

export function ContainerSettingsContextProvider({children}: PropsWithChildren<any>) {
    const [width, setWidth] = useState<ContainerWidth | undefined>(undefined);

    const handleSetWidth = useCallback((next: ContainerWidth) => {
        console.log(`Setting container width to ${next}`);
        localStorage.setItem(WIDTH_KEY, next);
        setWidth(next);
    }, []);

    const defaultContext = useMemo<ContainerSettingsContextData>(() => {
        return {
            width: width || DEFAULT_WIDTH,
            setWidth: handleSetWidth
        };
    }, [width, handleSetWidth]);

    useEffect(() => {
        let configured = localStorage.getItem(WIDTH_KEY);
        if(configured) {
            setWidth(configured as ContainerWidth);
        } else {
            setWidth(DEFAULT_WIDTH);
        }
    }, []);

    return (
        <ContainerSettingsContext.Provider value={defaultContext}>
            {children}
        </ContainerSettingsContext.Provider>
    );
}

export function useContainerSettingsContext(): ContainerSettingsContextData {
    return useContext<ContainerSettingsContextData>(ContainerSettingsContext);
}
