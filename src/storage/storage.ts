import {MemoryStorage} from "./MemoryStorage";
import {StorageType} from "./types";

const TEST_KEY = "__check_storage_supported";

function isSupported(storage?: Storage) {
	if (!storage) {
		return false;
	}
	try {
		storage.setItem(TEST_KEY, "1");
		storage.removeItem(TEST_KEY);
		return true;
	} catch (e) {
		return false;
	}
}

function getStorageArea(type: StorageType): Storage {
	const preferred = type === "local" ? window.localStorage : window.sessionStorage;
	const fallback = type === "local" ? window.sessionStorage : window.localStorage;

	if (isSupported(preferred)) return preferred;
	if (isSupported(fallback)) return fallback;
	return new MemoryStorage();
}

type StorageChangeListener = (oldValue?: string, newValue?: string) => void;

class StorageWrapper {
	private readonly listeners = new Map<string, Set<StorageChangeListener>>();
	private readonly storageAreas = new Map<StorageType, Storage>();

	constructor() {
		// Initialize both storage areas
		this.storageAreas.set("local", getStorageArea("local"));
		this.storageAreas.set("session", getStorageArea("session"));

		window.addEventListener("storage", event => {
			const {storageArea, key, oldValue, newValue} = event;
			// Check against both storage areas
			if (key && oldValue != newValue) {
				for (const area of this.storageAreas.values()) {
					if (storageArea === area) {
						this.notifyChangeListener(key, oldValue || undefined, newValue || undefined);
						break;
					}
				}
			}
		});
	}

	private getArea(type?: StorageType): Storage {
		return this.storageAreas.get(type ?? "local")!;
	}

	addChangeListener(key: string, listener: StorageChangeListener) {
		this.getOrCreateListeners(key).add(listener);
	}

	removeChangeListener(key: string, listener: StorageChangeListener) {
		this.getOrCreateListeners(key).delete(listener);
	}

	write(key: string, value?: string, type?: StorageType) {
		const oldValue = this.read(key, type);
		const area = this.getArea(type);
		try {
			if (value !== undefined) {
				area.setItem(key, value);
			} else {
				area.removeItem(key);
			}
			this.notifyChangeListener(key, oldValue, value);
		} catch (error) {
			// ignore error
		}
	}

	delete(key: string, type?: StorageType) {
		const oldValue = this.read(key, type);
		const area = this.getArea(type);
		try {
			area.removeItem(key);
			this.notifyChangeListener(key, oldValue, undefined);
		} catch (error) {
			// ignore error
		}
	}

	read(key: string, type?: StorageType) {
		const area = this.getArea(type);
		try {
			return area.getItem(key);
		} catch (error) {
			// ignore error
			return null;
		}
	}

	private notifyChangeListener(key: string, oldValue: any, newValue: any) {
		const listeners = this.listeners.get(key);
		if (listeners) {
			listeners.forEach(listener => listener(oldValue, newValue));
		}
	}

	private getOrCreateListeners(key: string) {
		return this.listeners.get(key) || this.createListeners(key);
	}

	private createListeners(key: string) {
		const listeners = new Set<StorageChangeListener>();
		this.listeners.set(key, listeners);
		return listeners;
	}
}

export const storage = new StorageWrapper();
