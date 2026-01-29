import {useCallback, useLayoutEffect, useMemo, useState} from "react";
import {storage} from "./storage";
import {StorageType} from "./types";

export function useStorage<T>(key: string, defaultValue: T, storageType?: StorageType): [T, (newValue: T) => void] {
	const defaultValueSerialized = useMemo(() => JSON.stringify(defaultValue), [defaultValue]);

	const readStateFromStorage = useCallback(() => {
		const storageValue = storage.read(key, storageType);
		return storageValue ?? defaultValueSerialized;
	}, [key, defaultValueSerialized, storageType]);

	const [value, setValue] = useState(readStateFromStorage);

	const updateStateFromStorage = useCallback(() => {
		setValue(readStateFromStorage());
	}, [readStateFromStorage]);

	useLayoutEffect(() => {
		storage.addChangeListener(key, updateStateFromStorage);
		return () => storage.removeChangeListener(key, updateStateFromStorage);
	}, [key, updateStateFromStorage]);

	const typedValue = useMemo(() => {
		try {
			return JSON.parse(value);
		} catch (e) {
			console.warn(`Failed to parse storage value for key "${key}", falling back to default value.`, e);
			return defaultValue;
		}
	}, [value, key, defaultValue]);

	const setTypedValue = useCallback((newValue: T) => {
		const value = JSON.stringify(newValue);
		if (value != defaultValueSerialized) {
			storage.write(key, value, storageType);
		} else {
			storage.delete(key, storageType);
		}
	}, [key, defaultValueSerialized, storageType]);

	return [typedValue, setTypedValue];
}

/**
 * Convenience hook for localStorage. Equivalent to `useStorage(key, defaultValue, "local")`.
 */
export function useLocalStorage<T>(key: string, defaultValue: T): [T, (newValue: T) => void] {
	return useStorage(key, defaultValue, "local");
}

/**
 * Convenience hook for sessionStorage. Equivalent to `useStorage(key, defaultValue, "session")`.
 */
export function useSessionStorage<T>(key: string, defaultValue: T): [T, (newValue: T) => void] {
	return useStorage(key, defaultValue, "session");
}
