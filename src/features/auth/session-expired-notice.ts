const SESSION_EXPIRED_NOTICE_KEY = 'sass.auth.sessionExpiredNotice'

/** Persists a one-shot flag so login can show copy after RequireAuth redirect. */
export function setSessionExpiredNotice(): void {
  window.sessionStorage.setItem(SESSION_EXPIRED_NOTICE_KEY, '1')
}

/** Reads and clears the session-expired notice flag. */
export function consumeSessionExpiredNotice(): boolean {
  const value = window.sessionStorage.getItem(SESSION_EXPIRED_NOTICE_KEY)
  if (!value) {
    return false
  }

  window.sessionStorage.removeItem(SESSION_EXPIRED_NOTICE_KEY)
  return true
}

export const SESSION_EXPIRED_TITLE = 'Session expired'
export const SESSION_EXPIRED_MESSAGE =
  'Your session expired. Please sign in again.'
