import { describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/lib/api/api-client'
import { updateMyProfile } from './update-my-profile'

vi.mock('@/lib/api/api-client', () => ({
  apiClient: {
    patch: vi.fn(),
  },
}))

describe('updateMyProfile', () => {
  it('patches the current user profile at /users/me', async () => {
    const response = {
      id: 'profile-1',
      userId: 'user-1',
      email: 'owner@company.com',
      displayName: 'Updated',
      avatarUrl: null,
      preferences: {
        timezone: 'UTC',
        locale: 'en',
        theme: 'system',
        notifications: { email: true, inApp: true, marketing: false },
      },
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z',
    }
    vi.mocked(apiClient.patch).mockResolvedValue(response)

    await expect(updateMyProfile({ displayName: 'Updated' })).resolves.toEqual(
      response,
    )
    expect(apiClient.patch).toHaveBeenCalledWith('/users/me', {
      displayName: 'Updated',
    })
  })
})
