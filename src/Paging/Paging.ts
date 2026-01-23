export interface Page<T> {
	content: T[];
	totalPages: number;
	totalElements: number;
	number: number;
	numberOfElements: number;
	size: number;
	last: boolean;
	first: boolean;
	hasContent: boolean;
	hasNext: boolean;
	hasPrevious: boolean;
}

export interface Pageable<K = string> {
	pageNumber: number;
	pageSize: number;
	sort?: K;
	direction?: "asc" | "desc";
}

export interface PagingSettings<K> extends Pageable<K> {
	filters?: { [key: string]: any };
}

export interface Paging {
	updateSettings: <K>(settings: PagingSettings<K>) => void;
	getSettings: <K>() => PagingSettings<K>;
	toQueryString: (prefix?: string) => string;
}

export class PagingImpl implements Paging {
	private storage = sessionStorage;

	private readonly baseSettings = {pageNumber: 0, pageSize: 25};

	constructor(private _storageKey: string, private _unpaged: boolean = false) {
		const stored = this.storage.getItem(_storageKey);
		if (!stored) {
			this.storage.setItem(_storageKey, JSON.stringify(this.baseSettings));
		}
	}

	updateSettings<K>(settings: PagingSettings<K>) {
		this.storage.setItem(this._storageKey, JSON.stringify(settings));
	}

	getSettings<K>(): PagingSettings<K> {
		const stored = this.storage.getItem(this._storageKey);
		if (stored) return JSON.parse(stored) as PagingSettings<K>;
		return this.baseSettings;
	}

	resetSettings() {
		this.storage.setItem(this._storageKey, JSON.stringify(this.baseSettings));
	}

	toQueryString(prefix?: string) {
		const {pageNumber, pageSize, sort, direction, filters} = this.getSettings();
		let query = this._unpaged ? "&unpaged=true" : `page=${pageNumber}&size=${pageSize}`;
		if (sort) {
			query += `&sort=${sort},${direction || "desc"}`;
		}
		if (filters) {
			for (let key of Object.keys(filters)) {
				if (typeof filters[key] === "string") {
					query += `&${key}=${filters[key]}`;
				} else if (Array.isArray(filters[key])) {
					query = "&" + filters[key].map((v: any) => `${key}=${v}`).join("&");
				}
			}
		}

		return `${prefix ? (prefix + "&") : "?"}${query}`;
	}
}
