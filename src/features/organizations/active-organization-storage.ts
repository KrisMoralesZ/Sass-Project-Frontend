const ACTIVE_ORGANIZATION_ID_KEY = 'sass.org.activeOrganizationId'

/**
 * Active workspace id for `X-Organization-Id` (task 0.3.3).
 * Full org switcher / persistence UX lands in Phase 2.
 */
export function getActiveOrganizationId(): string | null {
  return window.sessionStorage.getItem(ACTIVE_ORGANIZATION_ID_KEY)
}

export function setActiveOrganizationId(organizationId: string): void {
  window.sessionStorage.setItem(ACTIVE_ORGANIZATION_ID_KEY, organizationId)
}

export function clearActiveOrganizationId(): void {
  window.sessionStorage.removeItem(ACTIVE_ORGANIZATION_ID_KEY)
}
