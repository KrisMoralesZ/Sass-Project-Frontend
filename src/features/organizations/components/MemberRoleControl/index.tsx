import { type ChangeEvent, type FC, useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import FormField from '@/components/ui/FormField'
import { describeMemberRoleUpdateError } from '../../members-errors'
import {
  getOrganizationRoleLabel,
  ORGANIZATION_ROLES,
  type OrganizationRole,
} from '../../permissions/organization-role'
import {
  $Actions,
  $DialogCopy,
  $DialogError,
  $Header,
  $Lead,
  $Notice,
  $Section,
  $Select,
  $Title,
} from './MemberRoleControl.sc'

export interface IMemberRoleControl {
  currentRole: OrganizationRole
  memberName: string
  roles?: readonly OrganizationRole[]
  /** Caller decides based on `member:update`; backend remains the source of truth. */
  canManage?: boolean
  isSubmitting?: boolean
  /** Prevents demotion/removal when this member is the last owner. */
  isLastOwner?: boolean
  /** Explains the backend rule when the member cannot be changed. */
  lastOwnerMessage?: string
  error?: unknown
  /** Must return a promise so the confirmation stays open until it settles. */
  onUpdateRole?: (role: OrganizationRole) => void | Promise<unknown>
  /** Storybook: start with the confirmation dialog open. */
  defaultConfirmOpen?: boolean
}

/**
 * Role-change control for member detail with a confirmation dialog
 * (task 3.5.1). `PATCH /members/:userId` requires `member:update`; the caller
 * gates rendering and the backend enforces last-owner and hierarchy rules.
 */
const MemberRoleControl: FC<IMemberRoleControl> = ({
  currentRole,
  memberName,
  roles = ORGANIZATION_ROLES,
  canManage = false,
  isSubmitting = false,
  isLastOwner = false,
  lastOwnerMessage,
  error,
  onUpdateRole,
  defaultConfirmOpen = false,
}) => {
  const [selectedRole, setSelectedRole] =
    useState<OrganizationRole>(currentRole)
  const [isConfirmOpen, setIsConfirmOpen] = useState(defaultConfirmOpen)

  useEffect(() => {
    setSelectedRole(currentRole)
  }, [currentRole])

  if (!canManage) {
    return null
  }

  const updateError = error ? describeMemberRoleUpdateError(error) : undefined
  const hasChange = selectedRole !== currentRole
  const lastOwnerNotice =
    lastOwnerMessage ??
    'This member is the last owner in this workspace. The backend requires at least one owner before a role change is allowed.'

  const closeConfirm = () => {
    if (isSubmitting) {
      return
    }

    setIsConfirmOpen(false)
  }

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(event.target.value as OrganizationRole)
  }

  const handleConfirm = async () => {
    if (isLastOwner) {
      return
    }

    try {
      await onUpdateRole?.(selectedRole)
      setIsConfirmOpen(false)
    } catch {
      // Keep the dialog open; the caller's `error` is shown below.
    }
  }

  return (
    <>
      <$Section>
        <$Header>
          <$Title>Role</$Title>
          <$Lead>Change what {memberName} can do in this workspace.</$Lead>
        </$Header>

        <FormField
          label="Workspace role"
          htmlFor="member-role"
          hint="Only owners can grant or revoke the Owner role."
        >
          <$Select
            id="member-role"
            value={selectedRole}
            onChange={handleChange}
            disabled={isSubmitting || isLastOwner}
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {getOrganizationRoleLabel(role)}
              </option>
            ))}
          </$Select>
        </FormField>

        {isLastOwner ? <$Notice role="note">{lastOwnerNotice}</$Notice> : null}

        <$Actions>
          <Button
            type="button"
            disabled={!hasChange || isSubmitting || isLastOwner}
            onClick={() => setIsConfirmOpen(true)}
          >
            Save role
          </Button>
        </$Actions>
      </$Section>

      <Dialog
        open={isConfirmOpen && !isLastOwner}
        onClose={closeConfirm}
        title={`Change ${memberName}'s role?`}
        closeOnOverlayClick={!isSubmitting}
        closeOnEscape={!isSubmitting}
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={closeConfirm}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              loading={isSubmitting}
              disabled={isLastOwner}
              onClick={() => {
                void handleConfirm()
              }}
            >
              Change role
            </Button>
          </>
        }
      >
        <$DialogCopy>
          {memberName} will become{' '}
          <strong>{getOrganizationRoleLabel(selectedRole)}</strong> in this
          workspace.
        </$DialogCopy>
        {updateError ? (
          <$DialogError role="alert">{updateError}</$DialogError>
        ) : null}
      </Dialog>
    </>
  )
}

export default MemberRoleControl
