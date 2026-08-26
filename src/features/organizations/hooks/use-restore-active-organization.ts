import { useEffect, useState } from 'react'
import {
  clearActiveOrganizationId,
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
  const [isRestored, setIsRestored] = useState(false)

  useEffect(() => {
    if (organizationsQuery.isLoading || organizationsQuery.isError) {
      return
    }

    const organizations = organizationsQuery.data?.items ?? []

    if (organizations.length === 0) {
      clearActiveOrganizationId()
      setIsRestored(true)
      return
    }

    const storedActiveId = getActiveOrganizationId()

    if (storedActiveId) {
      const orgExists = organizations.some((org) => org.id === storedActiveId)
      if (orgExists) {
        setIsRestored(true)
        return
      }
    }

    const firstOrg = organizations[0]
    if (firstOrg) {
      setActiveOrganizationId(firstOrg.id)
    }
    setIsRestored(true)
  }, [
    organizationsQuery.isLoading,
    organizationsQuery.isError,
    organizationsQuery.data,
  ])

  return {
    isRestored:
      isRestored || organizationsQuery.isPending || organizationsQuery.isError,
  }
}
