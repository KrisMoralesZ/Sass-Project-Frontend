import { clearActiveOrganizationId } from '@/features/organizations'
import { notifySessionCleared } from './session-events'
import { clearSessionTokens } from './session-storage'

/**
 * Clears persisted tokens and tenant context, then notifies React auth state.
 * Used by logout, failed refresh, and other flows that drop credentials
 * without going through `AuthSessionProvider.clearSession()`.
 */
export function clearClientSession(): void {
  clearSessionTokens()
  clearActiveOrganizationId()
  notifySessionCleared()
}
