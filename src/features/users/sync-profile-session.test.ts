import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { currentUserQueryKey } from '@/features/auth/api/get-current-user'
import type { AuthUserProfile } from '@/features/auth/auth-api.types'
import { myProfileQueryKey } from './api/get-my-profile'
import type { UserProfile } from './api/user-api.types'
import { syncProfileAfterUpdate } from './sync-profile-session'

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
    notifications: {
      email: true,
      inApp: true,
      marketing: false,
    },
  },
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
}

describe('syncProfileAfterUpdate', () => {
  it('refreshes profile caches and syncs the session display name', () => {
    const queryClient = new QueryClient()
    const syncSessionUserDisplayName = vi.fn()
    const currentUser: AuthUserProfile = {
      id: 'user-1',
      email: 'owner@company.com',
      displayName: 'Owner',
      createdAt: '2026-01-01T00:00:00.000Z',
    }
    queryClient.setQueryData(currentUserQueryKey, currentUser)

    syncProfileAfterUpdate(queryClient, syncSessionUserDisplayName, profile)

    expect(queryClient.getQueryData(myProfileQueryKey)).toEqual(profile)
    expect(
      queryClient.getQueryData<AuthUserProfile>(currentUserQueryKey),
    ).toEqual({
      ...currentUser,
      displayName: 'Updated Name',
    })
    expect(syncSessionUserDisplayName).toHaveBeenCalledWith('Updated Name')
  })

  it('leaves the current user cache unchanged when it is missing', () => {
    const queryClient = new QueryClient()
    const syncSessionUserDisplayName = vi.fn()

    syncProfileAfterUpdate(queryClient, syncSessionUserDisplayName, profile)

    expect(queryClient.getQueryData(currentUserQueryKey)).toBeUndefined()
    expect(syncSessionUserDisplayName).toHaveBeenCalledWith('Updated Name')
  })
})
