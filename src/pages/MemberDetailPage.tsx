import { useQuery } from '@tanstack/react-query'
import { type FC } from 'react'
import { useParams } from 'react-router-dom'
import Button from '@/components/ui/Button'
import MemberRoleBadge from '@/features/organizations/components/MemberRoleBadge'
import { organizationMemberQueryOptions } from '@/features/organizations/api/get-member'
import { describeMembersLoadError } from '@/features/organizations/members-errors'
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

      <$BackLink to={paths.members}>Back to members</$BackLink>
    </$Page>
  )
}

export default MemberDetailPage
