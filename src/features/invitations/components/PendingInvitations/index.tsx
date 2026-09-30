import { type FC, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Table, {
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import Toast from '@/components/ui/Toast'
import MemberRoleBadge from '@/features/organizations/components/MemberRoleBadge'
import { usePermission } from '@/features/organizations/hooks/use-permission'
import { OrganizationPermission } from '@/features/organizations/permissions/organization-permission'
import type { Invitation } from '../../api/invitation-api.types'
import { useListInvitations } from '../../hooks/use-list-invitations'
import { useRevokeInvitation } from '../../hooks/use-revoke-invitation'
import {
  describeInvitationRevokeError,
  describeInvitationsLoadError,
} from '../../invitation-errors'
import {
  $ErrorPanel,
  $ErrorTitle,
  $Expired,
  $Message,
  $Pagination,
  $PaginationActions,
  $PaginationSummary,
  $Section,
  $Title,
} from './PendingInvitations.sc'

const PAGE_SIZE = 20

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
  }).format(new Date(value))

export interface IPendingInvitations {
  organizationId: string
}

/**
 * Pending-invitation list with revoke (task 3.4.3). Gated on `invite:read`;
 * the Revoke action is gated on `invite:revoke` (backend remains the source of
 * truth). Requests only `pending`; the backend derives expired for overdue
 * invites, listed here as read-only rows.
 */
const PendingInvitations: FC<IPendingInvitations> = ({ organizationId }) => {
  const [page, setPage] = useState(1)
  const [pendingRevoke, setPendingRevoke] = useState<Invitation | null>(null)
  const [lastRevoked, setLastRevoked] = useState<Invitation | null>(null)
  const [revokeError, setRevokeError] = useState<string | null>(null)

  const inviteRead = usePermission(OrganizationPermission.INVITE_READ)
  const inviteRevoke = usePermission(OrganizationPermission.INVITE_REVOKE)
  const invitationsQuery = useListInvitations(organizationId, {
    page,
    limit: PAGE_SIZE,
    status: 'pending',
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  })
  const revokeMutation = useRevokeInvitation(organizationId)

  if (!inviteRead.allowed) {
    return null
  }

  const loadError = invitationsQuery.isError
    ? describeInvitationsLoadError(invitationsQuery.error)
    : undefined

  const confirmRevoke = () => {
    if (!pendingRevoke) {
      return
    }
    revokeMutation.mutate(pendingRevoke.id, {
      onSuccess: (revoked) => {
        setPendingRevoke(null)
        setLastRevoked(revoked)
      },
      onError: (error) => {
        setPendingRevoke(null)
        setRevokeError(describeInvitationRevokeError(error))
      },
    })
  }

  return (
    <$Section aria-labelledby="pending-invitations-title">
      <$Title id="pending-invitations-title">Pending invitations</$Title>

      {invitationsQuery.isPending ? (
        <$Message role="status">Loading invitations...</$Message>
      ) : invitationsQuery.isError ? (
        <$ErrorPanel role="alert">
          <$ErrorTitle>
            {loadError?.title ?? 'Pending invitations could not be loaded'}
          </$ErrorTitle>
          <$Message>{loadError?.message}</$Message>
          <Button type="button" onClick={() => void invitationsQuery.refetch()}>
            Try again
          </Button>
        </$ErrorPanel>
      ) : (
        <>
          <Table>
            <TableCaption>Pending invitations</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitationsQuery.data.items.length === 0 ? (
                <TableEmpty colSpan={5}>No pending invitations.</TableEmpty>
              ) : (
                invitationsQuery.data.items.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell>{invitation.email}</TableCell>
                    <TableCell>
                      <MemberRoleBadge role={invitation.role} />
                    </TableCell>
                    <TableCell>{formatDate(invitation.createdAt)}</TableCell>
                    <TableCell>{formatDate(invitation.expiresAt)}</TableCell>
                    <TableCell>
                      {invitation.status === 'expired' ? (
                        <$Expired>Expired</$Expired>
                      ) : inviteRevoke.allowed ? (
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={revokeMutation.isPending}
                          onClick={() => setPendingRevoke(invitation)}
                        >
                          Revoke
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <$Pagination
            aria-label="Invitations pagination"
            aria-busy={invitationsQuery.isFetching}
          >
            <$PaginationSummary>
              Page {invitationsQuery.data.pagination.page} of{' '}
              {invitationsQuery.data.pagination.totalPages} (
              {invitationsQuery.data.pagination.total} invitations)
            </$PaginationSummary>
            <$PaginationActions>
              <Button
                type="button"
                variant="secondary"
                disabled={!invitationsQuery.data.pagination.hasPreviousPage}
                onClick={() => setPage((currentPage) => currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={!invitationsQuery.data.pagination.hasNextPage}
                onClick={() => setPage((currentPage) => currentPage + 1)}
              >
                Next
              </Button>
            </$PaginationActions>
          </$Pagination>
        </>
      )}

      <Dialog
        open={pendingRevoke !== null}
        onClose={() => {
          if (!revokeMutation.isPending) {
            setPendingRevoke(null)
          }
        }}
        title="Revoke invitation"
        closeOnOverlayClick={!revokeMutation.isPending}
        closeOnEscape={!revokeMutation.isPending}
        footer={
          <>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setPendingRevoke(null)}
              disabled={revokeMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              loading={revokeMutation.isPending}
              onClick={confirmRevoke}
            >
              Revoke invite
            </Button>
          </>
        }
      >
        <$Message>
          {pendingRevoke
            ? `${pendingRevoke.email} will no longer be able to join with this invite. You can invite them again later.`
            : 'Revoke this invitation?'}
        </$Message>
      </Dialog>

      <Toast
        open={lastRevoked !== null}
        onClose={() => setLastRevoked(null)}
        variant="success"
        title="Invite revoked"
      >
        {lastRevoked
          ? `${lastRevoked.email}'s invite was revoked.`
          : undefined}
      </Toast>
      <Toast
        open={revokeError !== null}
        onClose={() => setRevokeError(null)}
        variant="error"
        title="Could not revoke invite"
      >
        {revokeError}
      </Toast>
    </$Section>
  )
}

export default PendingInvitations