import { useQuery } from '@tanstack/react-query'
import { type FC } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/ui/Button'
import MemberRoleBadge from '@/features/organizations/components/MemberRoleBadge'
import MemberRoleControl from '@/features/organizations/components/MemberRoleControl'
import RemoveMemberControl from '@/features/organizations/components/RemoveMemberControl'
import { organizationMemberQueryOptions } from '@/features/organizations/api/get-member'
import { describeMembersLoadError } from '@/features/organizations/members-errors'
import { useActiveOrganizationId } from '@/features/organizations/hooks/use-active-organization-id'
import { useListOrganizationMembers } from '@/features/organizations/hooks/use-list-organization-members'
import { usePermission } from '@/features/organizations/hooks/use-permission'
import { useRemoveMember } from '@/features/organizations/hooks/use-remove-member'
import { useUpdateMemberRole } from '@/features/organizations/hooks/use-update-member-role'
import { OrganizationPermission } from '@/features/organizations/permissions/organization-permission'
import { OrganizationRole } from '@/features/organizations/permissions/organization-role'
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
import {
  $Avatar,
  $BackLink,
  $Card,
  $Email,
  $Identity,
  $Meta,
  $MetaItem,
  $Name,
} from './MemberDetailPage.sc'

const MemberDetailPage: FC = () => {
  const { userId = '' } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const activeOrganizationId = useActiveOrganizationId()
  const memberQuery = useQuery({
    ...organizationMemberQueryOptions(activeOrganizationId ?? '', userId),
    retry: false,
  })
  const memberUpdate = usePermission(OrganizationPermission.MEMBER_UPDATE)
  const membersQuery = useListOrganizationMembers(activeOrganizationId, {
    page: 1,
    limit: 1000,
    sortBy: 'createdAt',
    sortOrder: 'ASC',
  })
  const updateRole = useUpdateMemberRole(activeOrganizationId ?? '', userId)
  const removeMember = useRemoveMember(activeOrganizationId ?? '', userId)

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
    const loadError = describeMembersLoadError(memberQuery.error, 'member')

    return (
      <$Page>
        {header}
        <$ErrorPanel role="alert">
          <$ErrorTitle>{loadError.title}</$ErrorTitle>
          <$Message>{loadError.message}</$Message>
          <Button type="button" onClick={() => void memberQuery.refetch()}>
            Try again
          </Button>
        </$ErrorPanel>
      </$Page>
    )
  }

  const member = memberQuery.data
  const memberName = member.displayName?.trim() || member.email
  const canManageRole =
    memberUpdate.allowed && member.userId !== memberUpdate.memberUserId
  const ownerCount = membersQuery.data?.items.filter(
    (candidate) => candidate.role === OrganizationRole.OWNER,
  ).length
  const isLastOwner =
    membersQuery.isSuccess &&
    member.role === OrganizationRole.OWNER &&
    (ownerCount ?? 0) <= 1

  return (
    <$Page>
      {header}
      <$Card>
        <$Identity>
          {member.avatarUrl ? (
            <$Avatar src={member.avatarUrl} alt={memberName} />
          ) : null}
          <div>
            <$Name>{memberName}</$Name>
            <$Email>{member.email}</$Email>
          </div>
        </$Identity>

        <$Meta>
          <$MetaItem>
            <dt>Role</dt>
            <dd>
              <MemberRoleBadge role={member.role} />
            </dd>
          </$MetaItem>
          <$MetaItem>
            <dt>Member ID</dt>
            <dd>{member.id}</dd>
          </$MetaItem>
          <$MetaItem>
            <dt>User ID</dt>
            <dd>{member.userId}</dd>
          </$MetaItem>
          <$MetaItem>
            <dt>Workspace ID</dt>
            <dd>{member.organizationId}</dd>
          </$MetaItem>
        </$Meta>
      </$Card>

      <MemberRoleControl
        currentRole={member.role}
        memberName={memberName}
        canManage={canManageRole}
        isSubmitting={updateRole.isPending}
        isLastOwner={isLastOwner}
        lastOwnerMessage="This member is the last owner in this workspace. Promote another member to Owner, or choose a different user, before changing this role."
        error={updateRole.error}
        onUpdateRole={(role) => updateRole.mutateAsync(role)}
      />

      <RemoveMemberControl
        memberName={memberName}
        canRemove={canManageRole}
        isRemoving={removeMember.isPending}
        isLastOwner={isLastOwner}
        lastOwnerMessage="This member is the last owner in this workspace. The backend requires at least one owner to remain before this member can be removed."
        error={removeMember.error}
        onRemove={async () => {
          await removeMember.mutateAsync()
          navigate(paths.members)
        }}
      />

      <$BackLink to={paths.members}>Back to members</$BackLink>
    </$Page>
  )
}

export default MemberDetailPage
