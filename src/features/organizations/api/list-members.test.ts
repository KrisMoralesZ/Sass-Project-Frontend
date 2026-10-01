import { describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/lib/api/api-client'
import {
  listOrganizationMembers,
  organizationMembersQueryKey,
  organizationMembersQueryOptions,
} from './list-members'

vi.mock('@/lib/api/api-client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}))

describe('listOrganizationMembers', () => {
  it('fetches paginated members with optional query params', async () => {
    const response = {
      items: [
        {
          id: 'member-1',
          organizationId: 'org-1',
          userId: 'user-1',
          role: 'OWNER',
          email: 'owner@company.com',
          displayName: 'Owner',
          avatarUrl: null,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }
    vi.mocked(apiClient.get).mockResolvedValue(response)

    const query = {
      page: 1,
      limit: 20,
      search: 'owner',
      sortBy: 'role' as const,
      sortOrder: 'ASC' as const,
    }

    await expect(listOrganizationMembers(query)).resolves.toEqual(response)
    expect(apiClient.get).toHaveBeenCalledWith('/members', { params: query })
  })
})

describe('organizationMembersQueryOptions', () => {
  it('scopes the query key by organization and query params', () => {
    const query = { page: 2, search: 'jane' }

    expect(organizationMembersQueryKey('org-1', query)).toEqual([
      'members',
      'org-1',
      query,
    ])
    expect(organizationMembersQueryOptions('org-1', query).queryKey).toEqual([
      'members',
      'org-1',
      query,
    ])
  })

  it('stays disabled without an active organization id', () => {
    expect(organizationMembersQueryOptions('').enabled).toBe(false)
  })
})
