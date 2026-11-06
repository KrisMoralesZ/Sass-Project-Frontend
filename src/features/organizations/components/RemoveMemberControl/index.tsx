import { type FC, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { describeMemberRemoveError } from '../../members-errors'
import {
  $DangerHeader,
  $DangerLead,
  $DangerTitle,
  $DangerZone,
  $DialogCopy,
  $DialogError,
  $Notice,
} from './RemoveMemberControl.sc'

export interface IRemoveMemberControl {
  memberName: string
  /** Caller gates this based on `member:update`; backend remains the source of truth. */
  canRemove?: boolean
  isRemoving?: boolean
  /** Prevents removing the last owner. */
  isLastOwner?: boolean
  /** Explains the backend rule when the member cannot be removed. */
  lastOwnerMessage?: string
  error?: unknown
  onRemove?: () => void | Promise<unknown>
  /** Storybook: start with the confirmation dialog open. */
  defaultConfirmOpen?: boolean
}

const RemoveMemberControl: FC<IRemoveMemberControl> = ({
  memberName,
  canRemove = false,
  isRemoving = false,
  isLastOwner = false,
  lastOwnerMessage,
  error,
  onRemove,
  defaultConfirmOpen = false,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(defaultConfirmOpen)

  if (!canRemove) {
    return null
  }

  const removeError = error ? describeMemberRemoveError(error) : undefined
  const lastOwnerNotice =
    lastOwnerMessage ??
    'This member is the last owner in this workspace. The backend requires at least one owner to remain before the member can be removed.'

  const closeConfirm = () => {
    if (!isRemoving) {
      setIsConfirmOpen(false)
    }
  }

  const handleConfirm = async () => {
    if (isLastOwner) {
      return
    }

    try {
      await onRemove?.()
      setIsConfirmOpen(false)
    } catch {
      // Keep the dialog open; the caller's mutation error is shown below.
    }
  }

  return (
    <>
      <$DangerZone>
        <$DangerHeader>
          <$DangerTitle>Remove member</$DangerTitle>
          <$DangerLead>
            Removing this member revokes their access to this workspace.
          </$DangerLead>
        </$DangerHeader>
        {isLastOwner ? <$Notice role="note">{lastOwnerNotice}</$Notice> : null}
        <Button
          type="button"
          variant="danger"
          onClick={() => setIsConfirmOpen(true)}
          disabled={isRemoving || isLastOwner}
        >
          Remove member
        </Button>
      </$DangerZone>

      <Dialog
        open={isConfirmOpen && !isLastOwner}
        onClose={closeConfirm}
        title={`Remove ${memberName} from this workspace?`}
        closeOnOverlayClick={!isRemoving}
        closeOnEscape={!isRemoving}
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={closeConfirm}
              disabled={isRemoving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              loading={isRemoving}
              disabled={isLastOwner}
              onClick={() => {
                void handleConfirm()
              }}
            >
              Remove member
            </Button>
          </>
        }
      >
        <$DialogCopy>
          <strong>{memberName}</strong> will lose access to this workspace. They
          may need a new invitation to rejoin.
        </$DialogCopy>
        {removeError ? (
          <$DialogError role="alert">{removeError}</$DialogError>
        ) : null}
      </Dialog>
    </>
  )
}

export default RemoveMemberControl
