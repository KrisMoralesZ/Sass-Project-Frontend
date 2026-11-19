import { queryOptions } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/api-client'
import type {
  ListProjectsQuery,
  ListProjectsResponse,
} from './project-api.types'

/** Tenant-scoped `GET /projects` for the active organization. */
export function listProjects(query?: ListProjectsQuery) {
  return apiClient.get<ListProjectsResponse>('/projects', { params: query })
}

export const projectsQueryKey = (
  organizationId: string,
  query?: ListProjectsQuery,
) => ['projects', organizationId, query] as const

export const projectsQueryOptions = (
  organizationId: string,
  query?: ListProjectsQuery,
) =>
  queryOptions({
    queryKey: projectsQueryKey(organizationId, query),
    queryFn: () => listProjects(query),
    enabled: organizationId.length > 0,
  })
