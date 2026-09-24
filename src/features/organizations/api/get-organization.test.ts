import { describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/lib/api/api-client'
import {
  getOrganization,
  organizationQueryKey,
  organizationQueryOptions,
} from './get-organization'

vi.mock('@/lib/api/api-client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}))

describe('getOrganization', () => {
  it('fetches a workspace by id', async () => {
    const organization = { id: 'org-1', name: 'Acme' }
    vi.mocked(apiClient.get).mockResolvedValue(organization)

    await expect(getOrganization('org-1')).resolves.toEqual(organization)
    expect(apiClient.get).toHaveBeenCalledWith('/organizations/org-1')
  })
})

describe('organizationQueryOptions', () => {
  it('builds a query key scoped to the organization id', () => {
    expect(organizationQueryKey('org-1')).toEqual(['organizations', 'org-1'])
    expect(organizationQueryOptions('org-1').queryKey).toEqual([
      'organizations',
      'org-1',
    ])
  })
})
