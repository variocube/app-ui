
export class MemoryStorage {

    private readonly data = new Map<string, string>();

    getItem(key: string) {
        return this.data.get(key);
    }

    setItem(key: string, value: string) {
        return this.data.set(key, value);
    }

    removeItem(key: string) {
        return this.data.delete(key);
    }

    clear() {
        return this.data.clear();
    }
}