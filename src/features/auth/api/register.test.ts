import { describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/lib/api/api-client'
import { register } from './register'

vi.mock('@/lib/api/api-client', () => ({
  apiClient: {
    post: vi.fn(),
  },
}))

describe('register', () => {
  it('posts the registration payload to /auth/register', async () => {
    const response = {
      user: {
        id: 'user-1',
        email: 'owner@company.com',
        displayName: 'Owner',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      tokens: {
        accessToken: 'access-1',
        refreshToken: 'refresh-1',
        expiresIn: 900,
      },
    }
    vi.mocked(apiClient.post).mockResolvedValue(response)

    await expect(
      register({
        email: 'owner@company.com',
        password: 'Password1',
        displayName: 'Owner',
      }),
    ).resolves.toEqual(response)
    expect(apiClient.post).toHaveBeenCalledWith('/auth/register', {
      email: 'owner@company.com',
      password: 'Password1',
      displayName: 'Owner',
    })
  })
})
