import {useCallback, useLayoutEffect, useMemo, useRef, useState} from "react";
import {storage} from "./storage";
import {StorageType} from "./types";

/** Updater function that derives the new value from the currently persisted one. */
export type StorageUpdater<T> = (previous: T) => T;

export type StorageSetter<T> = (newValue: T | StorageUpdater<T>) => void;

export function useStorage<T>(key: string, defaultValue: T, storageType?: StorageType): [T, StorageSetter<T>] {
	const defaultValueSerialized = useMemo(() => JSON.stringify(defaultValue), [defaultValue]);

	const parseValue = useCallback((serialized?: string | null): T => {
		if (serialized !== undefined && serialized !== null) {
			try {
				return JSON.parse(serialized);
			} catch (e) {
				console.warn(`Failed to parse storage value for key "${key}", falling back to default value.`, e);
			}
		}
		return defaultValueSerialized !== undefined ? JSON.parse(defaultValueSerialized) : undefined as T;
	}, [key, defaultValueSerialized]);

	const readStateFromStorage = useCallback(() => {
		const storageValue = storage.read(key, storageType);
		return storageValue ?? defaultValueSerialized;
	}, [key, defaultValueSerialized, storageType]);

	const [value, setValue] = useState(readStateFromStorage);

	const updateStateFromStorage = useCallback(() => {
		setValue(readStateFromStorage());
	}, [readStateFromStorage]);

	// The state is initialized once, so after the key or the storage type changed it would keep serving
	// the value of the previous entry. Adjust it while rendering rather than in an effect, so that no
	// commit - and no effect of a consumer - ever sees the previous entry's value paired with the new
	// key. This must be tied to the entry itself and not to `readStateFromStorage`, whose identity also
	// changes with the default value: that would loop for a default that is rebuilt on every render
	// (e.g. one containing a timestamp) while nothing is persisted for the entry yet.
	const entry = `${storageType ?? "local"}:${key}`;
	const syncedEntry = useRef(entry);

	if (syncedEntry.current !== entry) {
		syncedEntry.current = entry;
		setValue(readStateFromStorage());
	}

	useLayoutEffect(() => {
		storage.addChangeListener(key, updateStateFromStorage);
		return () => storage.removeChangeListener(key, updateStateFromStorage);
	}, [key, updateStateFromStorage]);

	const typedValue = useMemo(() => parseValue(value), [value, parseValue]);

	const setTypedValue = useCallback<StorageSetter<T>>((newValue) => {
		// An updater is applied to the currently persisted value, not to the one captured in the
		// caller's render closure. This keeps concurrent writers from overwriting each other.
		const resolved = typeof newValue === "function"
			? (newValue as StorageUpdater<T>)(parseValue(storage.read(key, storageType)))
			: newValue;
		const serialized = JSON.stringify(resolved);
		if (serialized != defaultValueSerialized) {
			storage.write(key, serialized, storageType);
		} else {
			storage.delete(key, storageType);
		}
	}, [key, defaultValueSerialized, storageType, parseValue]);

	return [typedValue, setTypedValue];
}

/**
 * Convenience hook for localStorage. Equivalent to `useStorage(key, defaultValue, "local")`.
 */
export function useLocalStorage<T>(key: string, defaultValue: T): [T, StorageSetter<T>] {
	return useStorage(key, defaultValue, "local");
}

/**
 * Convenience hook for sessionStorage. Equivalent to `useStorage(key, defaultValue, "session")`.
 */
export function useSessionStorage<T>(key: string, defaultValue: T): [T, StorageSetter<T>] {
	return useStorage(key, defaultValue, "session");
}
