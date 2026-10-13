import { type FC } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { setActiveOrganizationId } from '@/features/organizations/active-organization-storage'
import { useAcceptInvitation } from '@/features/invitations/hooks/use-accept-invitation'
import { describeInvitationAcceptError } from '@/features/invitations/invitation-errors'
import { paths } from '@/routes/paths'
import {
  $Actions,
  $DevNotice,
  $ErrorPanel,
  $ErrorTitle,
  $Eyebrow,
  $Lead,
  $Message,
  $Page,
  $Panel,
  $Title,
} from './InviteAcceptPage.sc'

const INVITE_ACCEPT_QUERY_PARAM = 'token'

/**
 * Accept-invite route for tokenized links (task 3.4.4). Authenticated but not
 * tenant-scoped: the organization comes from the invitation, so the accepted
 * workspace becomes the active one before entering the app shell.
 */
const InviteAcceptPage: FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get(INVITE_ACCEPT_QUERY_PARAM) ?? ''
  const acceptMutation = useAcceptInvitation({
    onAccepted: (data) => {
      setActiveOrganizationId(data.membership.organizationId)
      void navigate(paths.home, { replace: true })
    },
  })

  const attemptAccept = () => {
    if (token) {
      acceptMutation.mutate({ token })
    }
  }

  return (
    <$Page>
      <$Eyebrow>Invitation</$Eyebrow>
      <$Title>Accept your invitation</$Title>
      <$Lead>
        You have been invited to join a workspace. Accepting adds you as a
        member so you can start collaborating.
      </$Lead>

      {import.meta.env.DEV ? (
        <$DevNotice role="note">
          Development build: no email is sent — the invitation link is printed
          in the API server logs. Open it in a browser to accept.
        </$DevNotice>
      ) : null}

      {!token ? (
        <$ErrorPanel role="alert">
          <$ErrorTitle>Link is missing its token</$ErrorTitle>
          <$Message>
            This invitation link is incomplete. Ask the sender for a fresh link.
          </$Message>
        </$ErrorPanel>
      ) : acceptMutation.isSuccess ? (
        <$Message role="status">
          Invitation accepted. Taking you to your workspace...
        </$Message>
      ) : acceptMutation.isError ? (
        <$ErrorPanel role="alert">
          <$ErrorTitle>Invitation could not be accepted</$ErrorTitle>
          <$Message>
            {describeInvitationAcceptError(acceptMutation.error)}
          </$Message>
          <Button type="button" onClick={attemptAccept}>
            Try again
          </Button>
        </$ErrorPanel>
      ) : (
        <>
          <$Panel>
            <$Message>
              Once accepted, the workspace appears in your sidebar and you can
              start working with your team.
            </$Message>
          </$Panel>
          <$Actions>
            <Button
              type="button"
              loading={acceptMutation.isPending}
              onClick={attemptAccept}
            >
              Accept invitation
            </Button>
          </$Actions>
        </>
      )}
    </$Page>
  )
}

export default InviteAcceptPage
