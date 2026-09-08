import type { ListOrganizationsResponse } from './api/organization-api.types'
import {
  clearActiveOrganizationId,
  getActiveOrganizationId,
  setActiveOrganizationId,
} from './active-organization-storage'

/**
 * Pick a valid active workspace from the organizations the user can still
 * access. Keeps the stored id when it is still listed; otherwise the first
 * remaining workspace (or null when the list is empty).
 */
export function chooseActiveOrganizationId(
  storedId: string | null,
  availableIds: readonly string[],
): string | null {
  if (storedId && availableIds.includes(storedId)) {
    return storedId
  }

  return availableIds[0] ?? null
}

/** Write the chosen id, or clear storage when none remain. */
export function applyActiveOrganizationId(nextId: string | null): void {
  if (nextId === getActiveOrganizationId()) {
    return
  }

  if (nextId) {
    setActiveOrganizationId(nextId)
  } else {
    clearActiveOrganizationId()
  }
}

/** Drop an archived workspace from the switcher list cache (task 2.3.5). */
export function omitOrganizationFromList(
  list: ListOrganizationsResponse,
  organizationId: string,
): ListOrganizationsResponse {
  const items = list.items.filter(
    (organization) => organization.id !== organizationId,
  )
  const removed = list.items.length - items.length

  return {
    ...list,
    items,
    pagination: {
      ...list.pagination,
      total: Math.max(0, list.pagination.total - removed),
    },
  }
}
