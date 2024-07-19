/** Describes a Spring `Page` */
export interface SpringPage<T> {
	content: T[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
}

/** Describes a Spring `Pageable` */
export interface SpringPageable {
	sort?: string[] | undefined;
	size?: number | undefined;
	page?: number | undefined;
}
