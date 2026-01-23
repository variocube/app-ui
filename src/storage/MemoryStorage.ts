export class MemoryStorage implements Storage {
	private readonly data = new Map<string, string>();

	get length(): number {
		return this.data.size;
	}

	key(index: number): string | null {
		const keys = Array.from(this.data.keys());
		return keys[index] ?? null;
	}

	getItem(key: string): string | null {
		return this.data.get(key) ?? null;
	}

	setItem(key: string, value: string): void {
		this.data.set(key, value);
	}

	removeItem(key: string): void {
		this.data.delete(key);
	}

	clear(): void {
		this.data.clear();
	}
}
