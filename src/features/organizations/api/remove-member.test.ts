import { describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/lib/api/api-client'
import { removeMember } from './remove-member'

vi.mock('@/lib/api/api-client', () => ({
  apiClient: {
    delete: vi.fn(),
  },
}))

describe('removeMember', () => {
  it('deletes the member from the active workspace', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue(undefined)

    await expect(removeMember('user-1')).resolves.toBeUndefined()
    expect(apiClient.delete).toHaveBeenCalledWith('/members/user-1')
  })
})
