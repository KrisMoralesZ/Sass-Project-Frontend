import type { ListQuery, PaginatedResult } from '@/types/pagination'

export const PROJECT_STATUSES = ['ACTIVE', 'ARCHIVED'] as const

export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export const PROJECT_SORT_FIELDS = [
  'createdAt',
  'updatedAt',
  'name',
  'status',
] as const

export type ProjectSortField = (typeof PROJECT_SORT_FIELDS)[number]

export interface Project {
  id: string
  organizationId: string
  name: string
  description: string | null
  ownerId: string
  status: ProjectStatus
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface ListProjectsQuery extends ListQuery {
  sortBy?: ProjectSortField
}

export type ListProjectsResponse = PaginatedResult<Project>

export interface CreateProjectRequest {
  name: string
  description?: string
  metadata?: Record<string, unknown>
}

export interface UpdateProjectRequest {
  name?: string
  description?: string | null
  status?: ProjectStatus
  metadata?: Record<string, unknown>
}

export type CreateProjectResponse = Project
export type UpdateProjectResponse = Project
