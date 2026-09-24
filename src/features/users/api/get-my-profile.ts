import { queryOptions } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/api-client'
import type { UserProfile } from './user-api.types'

/** Thin API helper for `GET /users/me` (user-scoped; org header optional). */
export function getMyProfile() {
  return apiClient.get<UserProfile>('/users/me')
}

export const myProfileQueryKey = ['users', 'me'] as const

export const myProfileQueryOptions = () =>
  queryOptions({
    queryKey: myProfileQueryKey,
    queryFn: getMyProfile,
  })
