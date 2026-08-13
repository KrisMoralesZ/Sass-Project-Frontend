const ACCESS_TOKEN_KEY = 'sass.auth.accessToken'
const REFRESH_TOKEN_KEY = 'sass.auth.refreshToken'

/**
 * v1 token persistence (`sessionStorage`).
 * httpOnly cookie / BFF storage is deferred — see task 1.1.1.
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
