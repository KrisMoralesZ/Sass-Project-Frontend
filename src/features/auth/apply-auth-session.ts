import type { QueryClient } from '@tanstack/react-query'
import {
  currentUserQueryKey,
  currentUserQueryOptions,
} from './api/get-current-user'
import type { AuthSessionResponse } from './auth-api.types'
import type { AuthSessionContextValue } from './auth-session-context'

/**
 * Persist tokens, set the session user, and sync the `['auth', 'me']` cache
 * after a successful login/register response.
 */
export async function applyAuthSessionResponse(
  queryClient: QueryClient,
  establishSession: AuthSessionContextValue['establishSession'],
  data: AuthSessionResponse,
): Promise<void> {
  establishSession(
    {
      accessToken: data.tokens.accessToken,
      refreshToken: data.tokens.refreshToken,
    },
    data.user,
  )

  queryClient.setQueryData(currentUserQueryKey, data.user)
  await queryClient.invalidateQueries({ queryKey: currentUserQueryKey })
  await queryClient.prefetchQuery({
    ...currentUserQueryOptions(),
    retry: false,
  })
}
