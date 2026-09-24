import { describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/lib/api/api-client'
import { updateOrganization } from './update-organization'

vi.mock('@/lib/api/api-client', () => ({
  apiClient: {
    patch: vi.fn(),
  },
}))

describe('updateOrganization', () => {
  it('patches the workspace at /organizations/:id', async () => {
    const organization = { id: 'org-1', name: 'Acme Updated' }
    vi.mocked(apiClient.patch).mockResolvedValue(organization)

    await expect(
      updateOrganization('org-1', { name: 'Acme Updated' }),
    ).resolves.toEqual(organization)
    expect(apiClient.patch).toHaveBeenCalledWith('/organizations/org-1', {
      name: 'Acme Updated',
    })
  })
})
