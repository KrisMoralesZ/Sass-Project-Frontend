import { describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/lib/api/api-client'
import { createProject } from './create-project'
import { deleteProject } from './delete-project'
import { getProject, projectQueryKey, projectQueryOptions } from './get-project'
import {
  listProjects,
  projectsQueryKey,
  projectsQueryOptions,
} from './list-projects'
import { PROJECT_SORT_FIELDS, PROJECT_STATUSES } from './project-api.types'
import { updateProject } from './update-project'

vi.mock('@/lib/api/api-client', () => ({
  apiClient: {
    delete: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    post: vi.fn(),
  },
}))

describe('project API helpers', () => {
  it('mirrors project statuses and supported sort fields', () => {
    expect(PROJECT_STATUSES).toEqual(['ACTIVE', 'ARCHIVED'])
    expect(PROJECT_SORT_FIELDS).toEqual([
      'createdAt',
      'updatedAt',
      'name',
      'status',
    ])
  })

  it('lists projects with pagination and optional filters', async () => {
    const response = {
      items: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }
    const query = {
      page: 1,
      limit: 20,
      search: 'website',
      sortBy: 'name' as const,
    }
    vi.mocked(apiClient.get).mockResolvedValue(response)

    await expect(listProjects(query)).resolves.toEqual(response)
    expect(apiClient.get).toHaveBeenCalledWith('/projects', { params: query })
  })

  it('gets a project by id', async () => {
    const project = { id: 'project-1', name: 'Website' }
    vi.mocked(apiClient.get).mockResolvedValue(project)

    await expect(getProject('project-1')).resolves.toEqual(project)
    expect(apiClient.get).toHaveBeenCalledWith('/projects/project-1')
  })

  it('creates a project with the backend request shape', async () => {
    const request = {
      name: 'Website',
      description: 'Redesign',
      metadata: { color: 'blue' },
    }
    const project = { id: 'project-1', ...request }
    vi.mocked(apiClient.post).mockResolvedValue(project)

    await expect(createProject(request)).resolves.toEqual(project)
    expect(apiClient.post).toHaveBeenCalledWith('/projects', request)
  })

  it('updates a project with the backend patch shape', async () => {
    const request = { description: null, status: 'ARCHIVED' as const }
    const project = { id: 'project-1', ...request }
    vi.mocked(apiClient.patch).mockResolvedValue(project)

    await expect(updateProject('project-1', request)).resolves.toEqual(project)
    expect(apiClient.patch).toHaveBeenCalledWith(
      '/projects/project-1',
      request,
    )
  })

  it('deletes a project through the 204 endpoint', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue(undefined)

    await expect(deleteProject('project-1')).resolves.toBeUndefined()
    expect(apiClient.delete).toHaveBeenCalledWith('/projects/project-1')
  })
})

describe('project query options', () => {
  it('includes active organization and list filters in the list key', () => {
    const query = { page: 2, search: 'website' }

    expect(projectsQueryKey('org-1', query)).toEqual([
      'projects',
      'org-1',
      query,
    ])
    expect(projectsQueryOptions('org-1', query).queryKey).toEqual([
      'projects',
      'org-1',
      query,
    ])
  })

  it('includes active organization and project id in the detail key', () => {
    expect(projectQueryKey('org-1', 'project-1')).toEqual([
      'projects',
      'org-1',
      'project-1',
    ])
    expect(projectQueryOptions('org-1', 'project-1').queryKey).toEqual([
      'projects',
      'org-1',
      'project-1',
    ])
  })

  it('disables list and detail queries without organization context', () => {
    expect(projectsQueryOptions('').enabled).toBe(false)
    expect(projectsQueryOptions('org-1').enabled).toBe(true)
    expect(projectQueryOptions('', 'project-1').enabled).toBe(false)
    expect(projectQueryOptions('org-1', '').enabled).toBe(false)
    expect(projectQueryOptions('org-1', 'project-1').enabled).toBe(true)
  })
})
