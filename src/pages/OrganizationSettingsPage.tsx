import { type FC, useState } from 'react'
import Button from '@/components/ui/Button'
import Toast from '@/components/ui/Toast'
import { useActiveOrganizationId } from '@/features/organizations/hooks/use-active-organization-id'
import { useOrganization } from '@/features/organizations/hooks/use-organization'
import { useUpdateOrganization } from '@/features/organizations/hooks/use-update-organization'
import type { OrganizationSettingsPatch } from '@/features/organizations/api/organization-api.types'
import OrganizationSettingsForm from '@/features/organizations/components/OrganizationSettingsForm'
import { OrganizationPermission } from '@/features/organizations/permissions/organization-permission'
import { usePermission } from '@/features/organizations/hooks/use-permission'
import {
  describeOrganizationWorkspaceLoadError,
  isOrganizationSettingsAccessError,
} from '@/features/organizations/organization-settings-errors'
import {
  $ErrorPanel,
  $ErrorTitle,
  $Eyebrow,
  $Header,
  $Lead,
  $Message,
  $Meta,
  $MetaItem,
  $Page,
  $Title,
} from './OrganizationSettingsPage.sc'

/**
 * Organization settings screen for the active workspace (task 2.3.1).
 * Edits require `settings:update`; PATCH remains backend-enforced (task 2.3.2).
 * Forbidden, validation, and tenant-context failures map to field or page copy
 * (task 2.3.3).
 */
const OrganizationSettingsPage: FC = () => {
  const activeOrganizationId = useActiveOrganizationId()
  const organizationQuery = useOrganization(activeOrganizationId)
  const updateOrganizationMutation = useUpdateOrganization(
    activeOrganizationId ?? '',
  )
  const settingsUpdate = usePermission(OrganizationPermission.SETTINGS_UPDATE)
  const [isSavedToastOpen, setIsSavedToastOpen] = useState(false)
  const canUpdate = settingsUpdate.allowed

  const handleSubmit = (settings: OrganizationSettingsPatch) => {
    if (!canUpdate) {
      return
    }

    updateOrganizationMutation.mutate(
      { settings },
      {
        onSuccess: () => {
          setIsSavedToastOpen(true)
        },
      },
    )
  }

  const header = (
    <$Header>
      <$Eyebrow>Workspace</$Eyebrow>
      <$Title>Organization settings</$Title>
      <$Lead>
        Regional defaults and branding placeholders for the active workspace.
      </$Lead>
    </$Header>
  )

  if (!activeOrganizationId) {
    return (
      <$Page>
        {header}
        <$Message>
          Select a workspace in the sidebar to manage its settings.
        </$Message>
      </$Page>
    )
  }

  if (organizationQuery.isPending) {
    return (
      <$Page>
        {header}
        <$Message>Loading workspace settings...</$Message>
      </$Page>
    )
  }

  if (organizationQuery.isError) {
    const loadError = describeOrganizationWorkspaceLoadError(
      organizationQuery.error,
    )

    return (
      <$Page>
        {header}
        <$ErrorPanel role="alert">
          <$ErrorTitle>{loadError.title}</$ErrorTitle>
          <$Message>{loadError.message}</$Message>
          <Button
            type="button"
            onClick={() => void organizationQuery.refetch()}
          >
            Try again
          </Button>
        </$ErrorPanel>
      </$Page>
    )
  }

  const organization = organizationQuery.data
  const saveApiError = updateOrganizationMutation.isError
    ? updateOrganizationMutation.error
    : settingsUpdate.isError
      ? settingsUpdate.error
      : undefined
  const saveAccessBlocked =
    updateOrganizationMutation.isError &&
    isOrganizationSettingsAccessError(updateOrganizationMutation.error)
  const isReadOnly = !canUpdate || saveAccessBlocked

  return (
    <$Page>
      {header}
      <$Meta>
        <$MetaItem>
          <dt>Name</dt>
          <dd>{organization.name}</dd>
        </$MetaItem>
        <$MetaItem>
          <dt>Slug</dt>
          <dd>{organization.slug}</dd>
        </$MetaItem>
        <$MetaItem>
          <dt>Plan</dt>
          <dd>{organization.plan}</dd>
        </$MetaItem>
      </$Meta>
      <OrganizationSettingsForm
        settings={organization.settings}
        onSubmit={handleSubmit}
        isSubmitting={updateOrganizationMutation.isPending}
        readOnly={isReadOnly}
        readOnlyMessage={
          saveAccessBlocked || settingsUpdate.isError
            ? undefined
            : settingsUpdate.isPending
              ? 'Checking whether you can edit these settings...'
              : 'You can view these settings, but only admins and owners can change them.'
        }
        apiError={saveApiError}
      />
      <Toast
        open={isSavedToastOpen}
        onClose={() => setIsSavedToastOpen(false)}
        variant="success"
        title="Settings saved"
      >
        {organization.name} now uses the updated defaults.
      </Toast>
    </$Page>
  )
}

export default OrganizationSettingsPage
