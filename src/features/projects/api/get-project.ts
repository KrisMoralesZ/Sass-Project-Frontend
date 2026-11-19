import { queryOptions } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/api-client'
import type { Project } from './project-api.types'

/** Tenant-scoped `GET /projects/:id` for the active organization. */
export function getProject(projectId: string) {
  return apiClient.get<Project>(`/projects/${projectId}`)
}

export const projectQueryKey = (
  organizationId: string,
  projectId: string,
) => ['projects', organizationId, projectId] as const

export const projectQueryOptions = (
  organizationId: string,
  projectId: string,
) =>
  queryOptions({
    queryKey: projectQueryKey(organizationId, projectId),
    queryFn: () => getProject(projectId),
    enabled: organizationId.length > 0 && projectId.length > 0,
  })
