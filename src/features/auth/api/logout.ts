import { apiClient } from '@/lib'
import type { LogoutResponse } from '../auth-api.types'
import { clearClientSession } from '../clear-client-session'
import { getRefreshToken } from '../session-storage'

/**
 * `POST /auth/logout` — revokes the refresh token when possible.
 * Always clears local auth state afterward, even if the request fails.
 */
export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken()

  try {
    if (refreshToken) {
      await apiClient.post<LogoutResponse>('/auth/logout', { refreshToken })
    }
  } catch {
    // Server revocation is best-effort; client session is cleared in `finally`.
  } finally {
    clearClientSession('logout')
  }
}
