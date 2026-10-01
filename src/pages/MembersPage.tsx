import { type FC, type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import FormField from '@/components/ui/FormField'
import Input from '@/components/ui/Input'
import Table, {
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import MemberRoleBadge from '@/features/organizations/components/MemberRoleBadge'
import type { OrganizationMember } from '@/features/organizations/api/get-member'
import { describeMembersLoadError } from '@/features/organizations/members-errors'
import { useActiveOrganizationId } from '@/features/organizations/hooks/use-active-organization-id'
import { useListOrganizationMembers } from '@/features/organizations/hooks/use-list-organization-members'
import { paths } from '@/routes/paths'
import {
  $ErrorPanel,
  $ErrorTitle,
  $Eyebrow,
  $Header,
  $Lead,
  $Message,
  $Page,
  $Pagination,
  $PaginationActions,
  $PaginationSummary,
  $SearchField,
  $Title,
  $Toolbar,
} from './MembersPage.sc'

const PAGE_SIZE = 20

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
  }).format(new Date(value))

const getMemberName = (member: OrganizationMember) =>
  member.displayName?.trim() || member.email

const MembersPage: FC = () => {
  const activeOrganizationId = useActiveOrganizationId()
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const membersQuery = useListOrganizationMembers(activeOrganizationId, {
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    sortBy: 'createdAt',
    sortOrder: 'ASC',
  })
  const membersLoadError = membersQuery.isError
    ? describeMembersLoadError(membersQuery.error)
    : undefined

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSearch(searchInput.trim())
    setPage(1)
  }

  const header = (
    <$Header>
      <$Eyebrow>Workspace</$Eyebrow>
      <$Title>Members</$Title>
      <$Lead>People with access to the active workspace.</$Lead>
    </$Header>
  )

  if (!activeOrganizationId) {
    return (
      <$Page>
        {header}
        <$Message>Select a workspace to view its members.</$Message>
      </$Page>
    )
  }

  return (
    <$Page>
      {header}
      <$Toolbar onSubmit={handleSearchSubmit} role="search">
        <$SearchField>
          <FormField label="Search members" htmlFor="member-search">
            <Input
              id="member-search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Name or email"
              fullWidth
            />
          </FormField>
        </$SearchField>
        <Button type="submit">Search</Button>
      </$Toolbar>

      {membersQuery.isPending ? (
        <$Message role="status">Loading members...</$Message>
      ) : membersQuery.isError ? (
        <$ErrorPanel role="alert">
          <$ErrorTitle>
            {membersLoadError?.title ?? 'Members could not be loaded'}
          </$ErrorTitle>
          <$Message>{membersLoadError?.message}</$Message>
          <Button type="button" onClick={() => void membersQuery.refetch()}>
            Try again
          </Button>
        </$ErrorPanel>
      ) : (
        <>
          <Table>
            <TableCaption>Workspace members</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {membersQuery.data.items.length === 0 ? (
                <TableEmpty colSpan={4}>
                  {search
                    ? 'No members match your search.'
                    : 'No members in this workspace yet.'}
                </TableEmpty>
              ) : (
                membersQuery.data.items.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <Link to={`${paths.members}/${member.userId}`}>
                        {getMemberName(member)}
                      </Link>
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      <MemberRoleBadge role={member.role} />
                    </TableCell>
                    <TableCell>{formatDate(member.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <$Pagination
            aria-label="Members pagination"
            aria-busy={membersQuery.isFetching}
          >
            <$PaginationSummary>
              Page {membersQuery.data.pagination.page} of{' '}
              {membersQuery.data.pagination.totalPages} (
              {membersQuery.data.pagination.total} members)
            </$PaginationSummary>
            <$PaginationActions>
              <Button
                type="button"
                variant="secondary"
                disabled={!membersQuery.data.pagination.hasPreviousPage}
                onClick={() => setPage((currentPage) => currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={!membersQuery.data.pagination.hasNextPage}
                onClick={() => setPage((currentPage) => currentPage + 1)}
              >
                Next
              </Button>
            </$PaginationActions>
          </$Pagination>
        </>
      )}
    </$Page>
  )
}

export default MembersPage
