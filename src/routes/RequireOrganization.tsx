import { type FC, type ReactNode } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { getApiErrorMessage, isApiError } from '@/lib'
import {
  useListOrganizations,
  useRestoreActiveOrganization,
} from '@/features/organizations'
import { paths } from './paths'
import {
  $Actions,
  $EmptyState,
  $Message,
  $Title,
} from './RequireOrganization.sc'

export interface IRequireOrganization {
  children?: ReactNode
}

const RequireOrganization: FC<IRequireOrganization> = ({ children }) => {
  const navigate = useNavigate()
  const organizationsQuery = useListOrganizations()
  const { isRestored } = useRestoreActiveOrganization()

  if (organizationsQuery.isPending) {
    return <$Message>Loading your workspaces...</$Message>
  }

  if (!isRestored) {
    return <$Message>Restoring your workspace...</$Message>
  }

  if (organizationsQuery.isError) {
    return (
      <$EmptyState>
        <$Title>We could not load your workspaces</$Title>
        <$Message>
          {isApiError(organizationsQuery.error)
            ? getApiErrorMessage(organizationsQuery.error)
            : 'Please try again.'}
        </$Message>
        <$Actions>
          <Button
            type="button"
            onClick={() => void organizationsQuery.refetch()}
          >
            Try again
          </Button>
        </$Actions>
      </$EmptyState>
    )
  }

  if (organizationsQuery.data.items.length === 0) {
    return (
      <$EmptyState>
        <$Title>Create your first workspace</$Title>
        <$Message>
          You do not belong to an organization yet. Create one to start using
          your workspace.
        </$Message>
        <$Actions>
          <Button
            type="button"
            onClick={() => void navigate(paths.createOrganization)}
          >
            Create organization
          </Button>
        </$Actions>
      </$EmptyState>
    )
  }

  return children ?? <Outlet />
}

export default RequireOrganization
