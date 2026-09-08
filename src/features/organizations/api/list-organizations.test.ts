import { describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/lib/api/api-client'
import {
  listOrganizations,
  organizationsQueryKey,
  organizationsQueryOptions,
} from './list-organizations'

vi.mock('@/lib/api/api-client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}))

describe('listOrganizations', () => {
  it('fetches the workspace list with optional query params', async () => {
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
    vi.mocked(apiClient.get).mockResolvedValue(response)

    await expect(listOrganizations({ page: 2, limit: 10 })).resolves.toEqual(
      response,
    )
    expect(apiClient.get).toHaveBeenCalledWith('/organizations', {
      params: { page: 2, limit: 10 },
    })
  })
})

describe('organizationsQueryOptions', () => {
  it('includes query params in the query key', () => {
    const query = { page: 2, limit: 10 }
    expect(organizationsQueryKey).toEqual(['organizations'])
    expect(organizationsQueryOptions(query).queryKey).toEqual([
      'organizations',
      query,
    ])
  })
})
