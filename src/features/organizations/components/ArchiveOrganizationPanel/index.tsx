import { type FC, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { describeOrganizationArchiveError } from '../../organization-archive-errors'
import {
  $DangerHeader,
  $DangerLead,
  $DangerTitle,
  $DangerZone,
  $DialogCopy,
  $DialogError,
} from './ArchiveOrganizationPanel.sc'

export interface IArchiveOrganizationPanel {
  organizationName: string
  /** Owners only; backend `DELETE` still requires OWNER. */
  canArchive?: boolean
  isArchiving?: boolean
  error?: unknown
  onArchive?: () => void | Promise<unknown>
  /** Storybook: start with the confirmation dialog open. */
  defaultConfirmOpen?: boolean
}

/**
 * Owner-only archive control with a confirmation dialog (task 2.3.4).
 * `DELETE /organizations/:id` remains backend-enforced.
 */
const ArchiveOrganizationPanel: FC<IArchiveOrganizationPanel> = ({
  organizationName,
  canArchive = false,
  isArchiving = false,
  error,
  onArchive,
  defaultConfirmOpen = false,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(defaultConfirmOpen)

  if (!canArchive) {
    return null
  }

  const archiveError = error
    ? describeOrganizationArchiveError(error)
    : undefined

  const closeConfirm = () => {
    if (isArchiving) {
      return
    }

    setIsConfirmOpen(false)
  }

  const handleConfirm = async () => {
    try {
      await onArchive?.()
      setIsConfirmOpen(false)
    } catch {
      // Keep the dialog open; `error` from the caller is shown below.
    }
  }

  return (
    <>
      <$DangerZone>
        <$DangerHeader>
          <$DangerTitle>Archive workspace</$DangerTitle>
          <$DangerLead>
            Archiving hides this workspace from everyone. Members lose access,
            and it cannot be undone from the app.
          </$DangerLead>
        </$DangerHeader>
        <Button
          type="button"
          variant="danger"
          onClick={() => setIsConfirmOpen(true)}
          disabled={isArchiving}
        >
          Archive workspace
        </Button>
      </$DangerZone>

      <Dialog
        open={isConfirmOpen}
        onClose={closeConfirm}
        title={`Archive ${organizationName}?`}
        closeOnOverlayClick={!isArchiving}
        closeOnEscape={!isArchiving}
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={closeConfirm}
              disabled={isArchiving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              loading={isArchiving}
              onClick={() => {
                void handleConfirm()
              }}
            >
              Archive
            </Button>
          </>
        }
      >
        <$DialogCopy>
          This archives <strong>{organizationName}</strong> for every member.
          You cannot undo this from the app.
        </$DialogCopy>
        {archiveError ? (
          <$DialogError role="alert">{archiveError}</$DialogError>
        ) : null}
      </Dialog>
    </>
  )
}

export default ArchiveOrganizationPanel
