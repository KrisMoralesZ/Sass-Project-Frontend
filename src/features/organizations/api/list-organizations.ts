import { queryOptions } from '@tanstack/react-query'
import { apiClient } from '@/lib'
import type {
  ListOrganizationsQuery,
  ListOrganizationsResponse,
} from './organization-api.types'

export function listOrganizations(query?: ListOrganizationsQuery) {
  return apiClient.get<ListOrganizationsResponse>('/organizations', {
    params: query,
  })
}

export const organizationsQueryKey = ['organizations'] as const

export const organizationsQueryOptions = (query?: ListOrganizationsQuery) =>
  queryOptions({
    queryKey: [...organizationsQueryKey, query] as const,
    queryFn: () => listOrganizations(query),
  })
