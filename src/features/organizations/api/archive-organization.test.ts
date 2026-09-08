import { describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/lib/api/api-client'
import { archiveOrganization } from './archive-organization'

vi.mock('@/lib/api/api-client', () => ({
  apiClient: {
    delete: vi.fn(),
  },
}))

describe('archiveOrganization', () => {
  it('soft-archives the workspace with DELETE /organizations/:id', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue(undefined)

    await expect(archiveOrganization('org-1')).resolves.toBeUndefined()
    expect(apiClient.delete).toHaveBeenCalledWith('/organizations/org-1')
  })
})
