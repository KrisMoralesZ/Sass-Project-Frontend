import { queryOptions } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/api-client'
import type { AuthUserProfile } from '../auth-api.types'

/** Thin API helper for `GET /auth/me` (task 0.3.6 smoke + Phase 1 reuse). */
export function getCurrentUser() {
  return apiClient.get<AuthUserProfile>('/auth/me')
}

export const currentUserQueryKey = ['auth', 'me'] as const

export const currentUserQueryOptions = () =>
  queryOptions({
    queryKey: currentUserQueryKey,
    queryFn: getCurrentUser,
  })
