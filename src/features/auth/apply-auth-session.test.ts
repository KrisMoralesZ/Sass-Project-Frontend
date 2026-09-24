import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { applyAuthSessionResponse } from './apply-auth-session'
import { currentUserQueryKey } from './api/get-current-user'
import type { AuthSessionResponse } from './auth-api.types'

const sessionResponse: AuthSessionResponse = {
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

describe('applyAuthSessionResponse', () => {
  it('persists tokens, updates cache, and prefetches the profile', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const establishSession = vi.fn()
    const invalidateQueries = vi
      .spyOn(queryClient, 'invalidateQueries')
      .mockResolvedValue(undefined)
    const prefetchQuery = vi
      .spyOn(queryClient, 'prefetchQuery')
      .mockResolvedValue(undefined)

    await applyAuthSessionResponse(
      queryClient,
      establishSession,
      sessionResponse,
    )

    expect(establishSession).toHaveBeenCalledWith(
      {
        accessToken: 'access-1',
        refreshToken: 'refresh-1',
      },
      sessionResponse.user,
    )
    expect(queryClient.getQueryData(currentUserQueryKey)).toEqual(
      sessionResponse.user,
    )
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: currentUserQueryKey,
    })
    expect(prefetchQuery).toHaveBeenCalledOnce()
  })
})
