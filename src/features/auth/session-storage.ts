const ACCESS_TOKEN_KEY = 'sass.auth.accessToken'
const REFRESH_TOKEN_KEY = 'sass.auth.refreshToken'

/**
 * Temporary token storage helpers for route-guard wiring (task 0.1.3).
 * Real login/refresh persistence lands in Phase 1.
 */
export function getAccessToken(): string | null {
  return window.sessionStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return window.sessionStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setSessionTokens(tokens: {
  accessToken: string
  refreshToken: string
}): void {
  window.sessionStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
  window.sessionStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
}

export function clearSessionTokens(): void {
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  window.sessionStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function hasSession(): boolean {
  return Boolean(getAccessToken())
}

/**
 * Dev-only helper so layout shells can be previewed before auth APIs are wired.
 */
export function setDevPreviewSession(): void {
  setSessionTokens({
    accessToken: 'dev-access-token',
    refreshToken: 'dev-refresh-token',
  })
}
