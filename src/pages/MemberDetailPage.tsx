import { useQuery } from '@tanstack/react-query'
import { type FC } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '@/components/ui/Button'
import MemberRoleBadge from '@/features/organizations/components/MemberRoleBadge'
import { organizationMemberQueryOptions } from '@/features/organizations/api/get-member'
import { useActiveOrganizationId } from '@/features/organizations/hooks/use-active-organization-id'
import { paths } from '@/routes/paths'
import {
  $ErrorPanel,
  $ErrorTitle,
  $Eyebrow,
  $Header,
  $Lead,
  $Message,
  $Page,
  $Title,
} from './MembersPage.sc'

const MemberDetailPage: FC = () => {
  const { userId = '' } = useParams<{ userId: string }>()
  const activeOrganizationId = useActiveOrganizationId()
  const memberQuery = useQuery({
    ...organizationMemberQueryOptions(activeOrganizationId ?? '', userId),
    retry: false,
  })

  const header = (
    <$Header>
      <$Eyebrow>Workspace</$Eyebrow>
      <$Title>Member details</$Title>
      <$Lead>Identity, access, and role details for this member.</$Lead>
    </$Header>
  )

  if (!activeOrganizationId) {
    return (
      <$Page>
        {header}
        <$Message>Select a workspace to inspect a member.</$Message>
      </$Page>
    )
  }

  if (memberQuery.isPending) {
    return (
      <$Page>
        {header}
        <$Message>Loading member details...</$Message>
      </$Page>
    )
  }

  if (memberQuery.isError) {
    return (
      <$Page>
        {header}
        <$ErrorPanel role="alert">
          <$ErrorTitle>Member details could not be loaded</$ErrorTitle>
          <$Message>
            Check that you still have access to this workspace, then try again.
          </$Message>
          <Button type="button" onClick={() => void memberQuery.refetch()}>
            Try again
          </Button>
        </$ErrorPanel>
      </$Page>
    )
  }

  const member = memberQuery.data
  const memberName = member.displayName?.trim() || member.email

  return (
    <$Page>
      {header}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1.5rem',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: '1rem',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {member.avatarUrl ? (
            <img
              src={member.avatarUrl}
              alt={memberName}
              style={{ width: '3rem', height: '3rem', borderRadius: '50%' }}
            />
          ) : null}
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {memberName}
            </div>
            <div style={{ color: '#6b7280' }}>{member.email}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <div>
            <strong>Role</strong>
            <div style={{ marginTop: '0.25rem' }}>
              <MemberRoleBadge role={member.role} />
            </div>
          </div>
          <div>
            <strong>User ID</strong>
            <div style={{ marginTop: '0.25rem' }}>{member.userId}</div>
          </div>
          <div>
            <strong>Workspace ID</strong>
            <div style={{ marginTop: '0.25rem' }}>{member.organizationId}</div>
          </div>
        </div>
      </div>

      <Link to={paths.members}>Back to members</Link>
    </$Page>
  )
}

export default MemberDetailPage
