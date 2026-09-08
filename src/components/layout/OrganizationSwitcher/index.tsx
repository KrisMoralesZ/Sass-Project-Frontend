import { type ChangeEvent, type FC } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useListOrganizations } from '@/features/organizations/hooks/use-list-organizations'
import { useActiveOrganizationId } from '@/features/organizations/hooks/use-active-organization-id'
import { setActiveOrganizationId } from '@/features/organizations/active-organization-storage'
import { useTenantContext } from '@/features/organizations/hooks/use-tenant-context'
import { isApiError } from '@/lib/api/api-error'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import {
  $Select,
  $SelectError,
  $SelectLoading,
  $SelectWrapper,
} from './OrganizationSwitcher.sc'

/**
 * Organization picker in the authenticated shell sidebar.
 * Tracks the active workspace through storage so archive and restore stay in
 * sync with the list (tasks 2.2.1 / 2.3.5).
 */
const OrganizationSwitcher: FC = () => {
  const queryClient = useQueryClient()
  const organizationsQuery = useListOrganizations()
  const activeOrgId = useActiveOrganizationId()
  const tenantContextQuery = useTenantContext(activeOrgId)

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextOrgId = event.target.value
    if (nextOrgId && nextOrgId !== activeOrgId) {
      setActiveOrganizationId(nextOrgId)
      void queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'organizations' &&
          typeof query.queryKey[1] === 'string',
      })
    }
  }

  if (organizationsQuery.isPending) {
    return <$SelectLoading>Loading...</$SelectLoading>
  }

  if (organizationsQuery.isError) {
    return (
      <$SelectError>
        {isApiError(organizationsQuery.error)
          ? getApiErrorMessage(organizationsQuery.error)
          : 'Failed to load organizations'}
      </$SelectError>
    )
  }

  if (!organizationsQuery.data || organizationsQuery.data.items.length === 0) {
    return <$SelectLoading>No organizations</$SelectLoading>
  }

  return (
    <$SelectWrapper>
      {activeOrgId && tenantContextQuery.isError && (
        <$SelectError>
          {isApiError(tenantContextQuery.error)
            ? getApiErrorMessage(tenantContextQuery.error)
            : 'This workspace is unavailable.'}
        </$SelectError>
      )}
      <$Select value={activeOrgId || ''} onChange={handleChange}>
        <option value="" disabled>
          Select a workspace
        </option>
        {organizationsQuery.data.items.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </$Select>
    </$SelectWrapper>
  )
}

export default OrganizationSwitcher
