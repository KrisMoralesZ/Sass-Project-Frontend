/**
 * Pagination and list-query types aligned with the Nest backend.
 * Mirrors `paginated-response.interface.ts` and list/pagination DTOs.
 */

export const DEFAULT_PAGE = 1
export const DEFAULT_LIMIT = 20
export const MAX_LIMIT = 100

export const SortOrder = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface PaginatedResult<T> {
  items: T[]
  pagination: PaginationMeta
}

export interface PaginationQuery {
  page?: number
  limit?: number
}

export interface SortQuery {
  sortBy?: string
  sortOrder?: SortOrder
}

export interface FilterQuery {
  search?: string
}

export type ListQuery = PaginationQuery & SortQuery & FilterQuery
