import { describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/lib/api/api-client'
import {
  getMyProfile,
  myProfileQueryKey,
  myProfileQueryOptions,
} from './get-my-profile'

vi.mock('@/lib/api/api-client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}))

describe('getMyProfile', () => {
  it('fetches the current user profile from /users/me', async () => {
    const profile = {
      id: 'profile-1',
      userId: 'user-1',
      email: 'owner@company.com',
      displayName: 'Owner',
      avatarUrl: null,
      preferences: {
        timezone: 'UTC',
        locale: 'en',
        theme: 'system',
        notifications: { email: true, inApp: true, marketing: false },
      },
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    vi.mocked(apiClient.get).mockResolvedValue(profile)

    await expect(getMyProfile()).resolves.toEqual(profile)
    expect(apiClient.get).toHaveBeenCalledWith('/users/me')
  })
})

describe('myProfileQueryOptions', () => {
  it('uses the stable profile query key', () => {
    expect(myProfileQueryKey).toEqual(['users', 'me'])
    expect(myProfileQueryOptions().queryKey).toEqual(['users', 'me'])
  })
})
