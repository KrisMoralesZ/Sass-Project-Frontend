import { useQuery } from '@tanstack/react-query'
import { useAuthSession } from '@/features/auth/useAuthSession'
import { organizationMemberQueryOptions } from '../api/get-member'
import { useActiveOrganizationId } from './use-active-organization-id'

/** Current user's membership in the active workspace (`GET /members/:userId`). */
export const useCurrentOrganizationMember = () => {
  const { user } = useAuthSession()
  const organizationId = useActiveOrganizationId()
  const userId = user?.id ?? ''

  return useQuery({
    ...organizationMemberQueryOptions(organizationId ?? '', userId),
    retry: false,
  })
}
