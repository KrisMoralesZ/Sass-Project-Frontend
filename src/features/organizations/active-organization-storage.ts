const ACTIVE_ORGANIZATION_ID_KEY = 'sass.org.activeOrganizationId'

const listeners = new Set<() => void>()

/**
 * Client-side active organization persistence API (task 2.2.2).
 * Stores the currently selected workspace id in sessionStorage.
 * Used by the API client to set the `X-Organization-Id` header on all tenant-scoped requests.
 *
 * Persistence scope:
 * - Survives hard page refresh within the same browser session
 * - Cleared on browser tab close or explicit session clear
 * - Synchronized across the switcher, creation flow, and API client
 */

/**
 * Get the currently active organization id.
 * @returns The stored organization id, or null if not set or session cleared.
 */
export function getActiveOrganizationId(): string | null {
  return window.sessionStorage.getItem(ACTIVE_ORGANIZATION_ID_KEY)
}

/**
 * Set the active organization id (e.g., after creation or workspace switch).
 * Triggers immediate API client header update on next request.
 * @param organizationId The id of the organization to activate
 */
export function setActiveOrganizationId(organizationId: string): void {
  window.sessionStorage.setItem(ACTIVE_ORGANIZATION_ID_KEY, organizationId)
  notifyActiveOrganizationChanged()
}

/**
 * Clear the active organization id (e.g., on logout or org removal).
 * Subsequent API calls will omit the `X-Organization-Id` header.
 */
export function clearActiveOrganizationId(): void {
  window.sessionStorage.removeItem(ACTIVE_ORGANIZATION_ID_KEY)
  notifyActiveOrganizationChanged()
}

/**
 * Subscribe to active organization changes so workspace-scoped screens re-render
 * instead of rendering data for the previously selected organization.
 */
export function subscribeActiveOrganizationId(
  listener: () => void,
): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function notifyActiveOrganizationChanged(): void {
  for (const listener of listeners) {
    listener()
  }
}
