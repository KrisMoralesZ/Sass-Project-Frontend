import { useQueryClient } from '@tanstack/react-query'
import { type ChangeEvent, type FC } from 'react'
import { useListOrganizations } from '@/features/organizations'
import {
  getActiveOrganizationId,
  setActiveOrganizationId,
} from '@/features/organizations'
import { getApiErrorMessage, isApiError } from '@/lib'
import {
  $Select,
  $SelectError,
  $SelectLoading,
  $SelectWrapper,
} from './OrganizationSwitcher.sc'

/**
 * Organization picker in the authenticated shell sidebar.
 * Shows the list of organizations the user belongs to and allows switching.
 * Task 2.2.1.
 */
export const OrganizationSwitcher: FC = () => {
  const queryClient = useQueryClient()
  const organizationsQuery = useListOrganizations()
  const activeOrgId = getActiveOrganizationId()

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
