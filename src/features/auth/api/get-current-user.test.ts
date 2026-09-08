import { describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/lib/api/api-client'
import {
  currentUserQueryKey,
  currentUserQueryOptions,
  getCurrentUser,
} from './get-current-user'

vi.mock('@/lib/api/api-client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}))

describe('getCurrentUser', () => {
  it('requests GET /auth/me', async () => {
    const profile = {
      id: 'user-1',
      email: 'owner@company.com',
      displayName: 'Owner',
      createdAt: '2026-01-01T00:00:00.000Z',
    }
    vi.mocked(apiClient.get).mockResolvedValue(profile)

    await expect(getCurrentUser()).resolves.toEqual(profile)
    expect(apiClient.get).toHaveBeenCalledWith('/auth/me')
  })

  it('exposes a stable query key and queryFn', () => {
    const options = currentUserQueryOptions()

    expect(currentUserQueryKey).toEqual(['auth', 'me'])
    expect(options.queryKey).toEqual(['auth', 'me'])
    expect(options.queryFn).toBeTypeOf('function')
  })
})
