/** Describes a Spring `Page` */
export interface SpringPage<T> {
	content?: T[] | undefined;
	totalElements?: number | undefined;
	totalPages?: number | undefined;
	size?: number | undefined;
	number?: number | undefined;
}

/** Describes a Spring `Pageable` */
export interface SpringPageable {
	sort?: string[] | undefined;
	size?: number | undefined;
	page?: number | undefined;
}
