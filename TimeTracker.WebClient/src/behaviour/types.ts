export type GetEntitiesResponse<T> = {
    entities: T[],
    pageSize: number,
    total: number,
}

export type Paging = {
    pageNumber: number;
    pageSize: number;
}