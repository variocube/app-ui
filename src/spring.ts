
/** Describes a Spring `Page` */
export interface SpringPage<T> {
    content: T[];
    totalElements: number;
    size: number;
    number: number;
}

/** Describes a Spring `Pageable` */
export interface SpringPageable {
    sort?: string;
    size?: number;
    page?: number;
}