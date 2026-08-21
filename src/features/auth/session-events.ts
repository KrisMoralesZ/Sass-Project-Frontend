export type SessionClearReason = 'logout' | 'expired'

type SessionClearedListener = (reason: SessionClearReason) => void

const listeners = new Set<SessionClearedListener>()

/**
 * Lets the API client notify React auth state when tokens are cleared
 * outside of `AuthSessionProvider.clearSession()` (e.g. failed refresh).
 */
export function subscribeSessionCleared(
  listener: SessionClearedListener,
): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function notifySessionCleared(reason: SessionClearReason): void {
  for (const listener of listeners) {
    listener(reason)
  }
}
