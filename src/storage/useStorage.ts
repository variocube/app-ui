import {useCallback, useEffect, useMemo, useState} from "react";
import {storage} from "./storage";

export function useStorage<T>(key: string, defaultValue: T): [T, (newValue: T) => void] {

    const readStateFromStorage = useCallback(() => {
        const storageValue = storage.read(key);
        return storageValue == null ? JSON.stringify(defaultValue) : storageValue;
    }, [key, defaultValue]);

    const [value, setValue] = useState(readStateFromStorage);

    const updateStateFromStorage = useCallback(() => {
        setValue(readStateFromStorage());
    }, [readStateFromStorage]);

    useEffect(() => {
        storage.addChangeListener(key, updateStateFromStorage);
        return () => storage.removeChangeListener(key, updateStateFromStorage);
    }, [key, updateStateFromStorage]);

    useEffect(() => {
        storage.write(key, value);
    }, [key, value]);

    const typedValue = useMemo(() => JSON.parse(value), [value]);
    const setTypedValue = useCallback((newValue: T) => setValue(JSON.stringify(newValue)), []);

    return [typedValue, setTypedValue];
}