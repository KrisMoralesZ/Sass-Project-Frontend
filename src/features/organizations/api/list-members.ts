import { queryOptions } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/api-client'
import type { ListQuery, PaginatedResult } from '@/types/pagination'
import type { OrganizationMember } from './get-member'

/** Mirrors backend `ORGANIZATION_MEMBER_SORT_FIELDS`. */
export const ORGANIZATION_MEMBER_SORT_FIELDS = [
  'createdAt',
  'updatedAt',
  'role',
] as const

export type OrganizationMemberSortField =
  (typeof ORGANIZATION_MEMBER_SORT_FIELDS)[number]

export interface ListOrganizationMembersQuery extends ListQuery {
  search?: string
  sortBy?: OrganizationMemberSortField
}

export type ListOrganizationMembersResponse =
  PaginatedResult<OrganizationMember>

/** Tenant-scoped `GET /members` for the active organization. */
export function listOrganizationMembers(query?: ListOrganizationMembersQuery) {
  return apiClient.get<ListOrganizationMembersResponse>('/members', {
    params: query,
  })
}

export const organizationMembersQueryKey = (
  organizationId: string,
  query?: ListOrganizationMembersQuery,
) => ['members', organizationId, query] as const

export const organizationMembersQueryOptions = (
  organizationId: string,
  query?: ListOrganizationMembersQuery,
) =>
  queryOptions({
    queryKey: organizationMembersQueryKey(organizationId, query),
    queryFn: () => listOrganizationMembers(query),
    enabled: organizationId.length > 0,
  })
