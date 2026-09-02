import { type FC, useState } from 'react'
import Button from '@/components/ui/Button'
import Toast from '@/components/ui/Toast'
import { useActiveOrganizationId } from '@/features/organizations/hooks/use-active-organization-id'
import { useOrganization } from '@/features/organizations/hooks/use-organization'
import { useUpdateOrganization } from '@/features/organizations/hooks/use-update-organization'
import type { OrganizationSettingsPatch } from '@/features/organizations/api/organization-api.types'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import OrganizationSettingsForm from '@/features/organizations/components/OrganizationSettingsForm'
import { OrganizationPermission } from '@/features/organizations/permissions/organization-permission'
import { usePermission } from '@/features/organizations/hooks/use-permission'
import {
  $ErrorPanel,
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
    return (
      <$Page>
        {header}
        <$ErrorPanel>
          <$Message>{getApiErrorMessage(organizationQuery.error)}</$Message>
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
        readOnly={!canUpdate}
        readOnlyMessage={
          settingsUpdate.isError
            ? undefined
            : settingsUpdate.isPending
              ? 'Checking whether you can edit these settings...'
              : 'You can view these settings, but only admins and owners can change them.'
        }
        formError={
          settingsUpdate.isError
            ? getApiErrorMessage(settingsUpdate.error)
            : updateOrganizationMutation.isError
              ? getApiErrorMessage(updateOrganizationMutation.error)
              : undefined
        }
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
