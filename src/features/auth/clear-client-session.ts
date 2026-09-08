import { clearActiveOrganizationId } from '../organizations/active-organization-storage'
import { notifySessionCleared, type SessionClearReason } from './session-events'
import { setSessionExpiredNotice } from './session-expired-notice'
import { clearSessionTokens } from './session-storage'

/**
 * Clears persisted tokens and tenant context, then notifies React auth state.
 * Used by logout, failed refresh, and other flows that drop credentials
 * without going through `AuthSessionProvider.clearSession()`.
 */
export function clearClientSession(
  reason: SessionClearReason = 'expired',
): void {
  clearSessionTokens()
  clearActiveOrganizationId()

  if (reason === 'expired') {
    setSessionExpiredNotice()
  }

  notifySessionCleared(reason)
}
