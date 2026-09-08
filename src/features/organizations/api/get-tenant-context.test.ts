import { describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/lib/api/api-client'
import {
  getTenantContext,
  tenantContextQueryKey,
  tenantContextQueryOptions,
} from './get-tenant-context'

vi.mock('@/lib/api/api-client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}))

describe('getTenantContext', () => {
  it('fetches the tenant context from /tenant/context', async () => {
    const context = { organizationId: 'org-1' }
    vi.mocked(apiClient.get).mockResolvedValue(context)

    await expect(getTenantContext()).resolves.toEqual(context)
    expect(apiClient.get).toHaveBeenCalledWith('/tenant/context')
  })
})

describe('tenantContextQueryOptions', () => {
  it('scopes the query key to the organization and disables without an id', () => {
    expect(tenantContextQueryKey('org-1')).toEqual([
      'tenant',
      'context',
      'org-1',
    ])
    expect(tenantContextQueryOptions('').enabled).toBe(false)
    expect(tenantContextQueryOptions('org-1').enabled).toBe(true)
  })
})
