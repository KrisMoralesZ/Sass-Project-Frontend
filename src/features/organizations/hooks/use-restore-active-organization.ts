import { useEffect } from 'react'
import {
  getActiveOrganizationId,
  setActiveOrganizationId,
} from '@/features/organizations/active-organization-storage'
import { useListOrganizations } from './use-list-organizations'

/**
 * Restore the previously active organization after hard refresh (task 2.2.3).
 * If the stored org id still exists in the list, restore it.
 * Otherwise, fall back to the first available organization.
 * Does nothing if organizations list is loading or has an error.
 */
export function useRestoreActiveOrganization() {
  const organizationsQuery = useListOrganizations()

  useEffect(() => {
    // Only run when query has successfully loaded
    if (organizationsQuery.isLoading || organizationsQuery.isError) {
      return
    }

    const organizations = organizationsQuery.data?.items ?? []

    // No organizations available; clear any stale active org
    if (organizations.length === 0) {
      const currentActive = getActiveOrganizationId()
      if (currentActive) {
        // Do not clear; let RequireOrganization handle the empty state
        // (user may be in the process of creating their first org)
      }
      return
    }

    const storedActiveId = getActiveOrganizationId()

    // Verify stored org still exists in the list
    if (storedActiveId) {
      const orgExists = organizations.some((org) => org.id === storedActiveId)
      if (orgExists) {
        // Stored org is still valid; nothing to do
        return
      }
    }

    // Fall back to first available organization (task 2.2.3 fallback)
    const firstOrg = organizations[0]
    if (firstOrg) {
      setActiveOrganizationId(firstOrg.id)
    }
  }, [
    organizationsQuery.isLoading,
    organizationsQuery.isError,
    organizationsQuery.data,
  ])
}
