import {
  type ChangeEvent,
  type FC,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import FormField from '@/components/ui/FormField'
import Input from '@/components/ui/Input'
import { getOrganizationRoleLabel } from '@/features/organizations/permissions/organization-role'
import {
  INVITATION_ASSIGNABLE_ROLES,
  type Invitation,
} from '../../api/invitation-api.types'
import { useCreateInvitation } from '../../hooks/use-create-invitation'
import { mapInvitationApiError } from '../../invitation-errors'
import {
  INITIAL_INVITE_MEMBER_VALUES,
  INVITE_EMAIL_MAX_LENGTH,
  toCreateInvitationRequest,
  validateInviteMemberForm,
  type InviteMemberFieldErrors,
  type InviteMemberField,
} from '../../invitation-settings'
import { $Form, $FormError, $Select } from './InviteMemberDialog.sc'

export interface IInviteMemberDialog {
  open: boolean
  onClose: () => void
  organizationId: string
  onInvited?: (invitation: Invitation) => void
}

/**
 * Invite-member dialog for the members page (task 3.4.2). Gated on
 * `invite:create` by the caller; the backend remains the source of truth.
 * Validation and duplicate/conflict failures map onto the email field while
 * forbidden and tenant failures stay at form level.
 */
const InviteMemberDialog: FC<IInviteMemberDialog> = ({
  open,
  onClose,
  organizationId,
  onInvited,
}) => {
  const createInviteMutation = useCreateInvitation(organizationId)
  const [values, setValues] = useState(INITIAL_INVITE_MEMBER_VALUES)
  const [fieldErrors, setFieldErrors] = useState<InviteMemberFieldErrors>({})
  const [formError, setFormError] = useState<string>()
  const isSubmitting = createInviteMutation.isPending
  const wasOpen = useRef(open)

  useEffect(() => {
    if (open && !wasOpen.current) {
      setValues(INITIAL_INVITE_MEMBER_VALUES)
      setFieldErrors({})
      setFormError(undefined)
    }
    wasOpen.current = open
  }, [open])

  const updateField =
    (field: InviteMemberField) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { value } = event.target
      setValues((current) => ({ ...current, [field]: value }))
      setFieldErrors((current) => {
        if (!current[field]) {
          return current
        }
        const next = { ...current }
        delete next[field]
        return next
      })
      setFormError(undefined)
    }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateInviteMemberForm(values)
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    createInviteMutation.mutate(toCreateInvitationRequest(values), {
      onSuccess: (invitation) => {
        onInvited?.(invitation)
        onClose()
      },
      onError: (error) => {
        const view = mapInvitationApiError(error)
        setFieldErrors(view.fieldErrors)
        setFormError(view.formError)
      },
    })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Invite a member"
      closeOnOverlayClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="invite-member-form"
            loading={isSubmitting}
          >
            Send invite
          </Button>
        </>
      }
    >
      <$Form id="invite-member-form" onSubmit={handleSubmit} noValidate>
        <FormField
          label="Email"
          htmlFor="invite-email"
          required
          error={fieldErrors.email}
        >
          <Input
            id="invite-email"
            type="email"
            autoComplete="off"
            placeholder="teammate@company.com"
            value={values.email}
            onChange={updateField('email')}
            maxLength={INVITE_EMAIL_MAX_LENGTH}
            disabled={isSubmitting}
            fullWidth
          />
        </FormField>
        <FormField
          label="Role"
          htmlFor="invite-role"
          hint="Controls what this person can do in the workspace."
          error={fieldErrors.role}
        >
          <$Select
            id="invite-role"
            value={values.role}
            onChange={updateField('role')}
            disabled={isSubmitting}
          >
            {INVITATION_ASSIGNABLE_ROLES.map((role) => (
              <option key={role} value={role}>
                {getOrganizationRoleLabel(role)}
              </option>
            ))}
          </$Select>
        </FormField>
        {formError ? <$FormError role="alert">{formError}</$FormError> : null}
      </$Form>
    </Dialog>
  )
}

export default InviteMemberDialog
