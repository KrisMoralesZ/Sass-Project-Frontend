import { useEffect, useState } from 'react'
import { useListOrganizations } from './use-list-organizations'
import {
  applyActiveOrganizationId,
  chooseActiveOrganizationId,
} from '../restore-active-organization'
import { getActiveOrganizationId } from '../active-organization-storage'

/**
 * Restore the previously active organization after hard refresh (task 2.2.3).
 * If the stored org id is gone (archived or unavailable), fall back to the first
 * remaining organization or clear the selection.
 */
export function useRestoreActiveOrganization() {
  const organizationsQuery = useListOrganizations()
  const [isRestored, setIsRestored] = useState(false)

  useEffect(() => {
    if (organizationsQuery.isLoading || organizationsQuery.isError) {
      return
    }

    const availableIds = (organizationsQuery.data?.items ?? []).map(
      (organization) => organization.id,
    )
    applyActiveOrganizationId(
      chooseActiveOrganizationId(getActiveOrganizationId(), availableIds),
    )
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
