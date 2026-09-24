import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { type ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AuthSessionProvider from '@/features/auth/AuthSessionProvider'
import { currentUserQueryKey } from '@/features/auth/api/get-current-user'
import { myProfileQueryKey } from '../api/get-my-profile'
import { updateMyProfile } from '../api/update-my-profile'
import type { UserProfile } from '../api/user-api.types'
import { useUpdateMyProfile } from './use-update-my-profile'

vi.mock('../api/update-my-profile', () => ({
  updateMyProfile: vi.fn(),
}))

vi.mock('@/features/auth/api/get-current-user', () => ({
  currentUserQueryKey: ['auth', 'me'],
  getCurrentUser: vi.fn(),
  currentUserQueryOptions: () => ({
    queryKey: ['auth', 'me'],
    queryFn: vi.fn(),
  }),
}))

const profile: UserProfile = {
  id: 'profile-1',
  userId: 'user-1',
  email: 'owner@company.com',
  displayName: 'Updated Name',
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

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  queryClient.setQueryData(currentUserQueryKey, {
    id: 'user-1',
    email: 'owner@company.com',
    displayName: 'Owner',
    createdAt: '2026-01-01T00:00:00.000Z',
  })

  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionProvider>{children}</AuthSessionProvider>
    </QueryClientProvider>
  )
}

describe('useUpdateMyProfile', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.mocked(updateMyProfile).mockReset()
    vi.mocked(updateMyProfile).mockResolvedValue(profile)
  })

  it('syncs profile caches and the session display name after a successful update', async () => {
    const { result } = renderHook(() => useUpdateMyProfile(), { wrapper })

    result.current.mutate({ displayName: 'Updated Name' })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(updateMyProfile).toHaveBeenCalledWith({
      displayName: 'Updated Name',
    })
  })
})

describe('useUpdateMyProfile cache sync', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.mocked(updateMyProfile).mockReset()
    vi.mocked(updateMyProfile).mockResolvedValue(profile)
  })

  it('writes the updated profile into the query cache', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    queryClient.setQueryData(currentUserQueryKey, {
      id: 'user-1',
      email: 'owner@company.com',
      displayName: 'Owner',
      createdAt: '2026-01-01T00:00:00.000Z',
    })

    const { result } = renderHook(() => useUpdateMyProfile(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          <AuthSessionProvider>{children}</AuthSessionProvider>
        </QueryClientProvider>
      ),
    })

    result.current.mutate({ displayName: 'Updated Name' })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(queryClient.getQueryData(myProfileQueryKey)).toEqual(profile)
  })
})
