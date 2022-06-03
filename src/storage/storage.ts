import {MemoryStorage} from "./MemoryStorage";

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

function findSupportedStorage() {
    return [window.localStorage, window.sessionStorage].find(isSupported)
        || new MemoryStorage();
}

type StorageChangeListener = (oldValue?: string, newValue?: string) => void;

class StorageWrapper {

    private readonly listeners = new Map<string, Set<StorageChangeListener>>();
    private readonly storageArea = findSupportedStorage();

    constructor() {
        window.addEventListener("storage", event => {
            const {storageArea, key, oldValue, newValue} = event;
            if (storageArea == this.storageArea && key && oldValue != newValue) {
                this.notifyChangeListener(key, oldValue || undefined, newValue || undefined);
            }
        });
    }

    addChangeListener(key: string, listener: StorageChangeListener) {
        this.getOrCreateListeners(key).add(listener);
    }

    removeChangeListener(key: string, listener: StorageChangeListener) {
        this.getOrCreateListeners(key).delete(listener);
    }

    write(key: string, value?: string) {
        const oldValue = this.read(key);
        try {
            if (value !== undefined) {
                this.storageArea.setItem(key, value);
            }
            else {
                this.storageArea.removeItem(key);
            }
        } catch (error) {
            // ignore error
        }
        this.notifyChangeListener(key, oldValue, value);
    }

    read(key: string) {
        try {
            return this.storageArea.getItem(key);
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


