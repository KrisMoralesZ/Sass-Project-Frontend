type SessionClearedListener = () => void

const listeners = new Set<SessionClearedListener>()

/**
 * Lets the API client notify React auth state when tokens are cleared
 * outside of `clearSession()` (e.g. failed refresh in 0.3.4).
 */
export function subscribeSessionCleared(
  listener: SessionClearedListener,
): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function notifySessionCleared(): void {
  for (const listener of listeners) {
    listener()
  }
}
