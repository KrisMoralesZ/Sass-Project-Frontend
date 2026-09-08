import { apiClient } from '@/lib/api/api-client'

export function archiveOrganization(organizationId: string) {
  return apiClient.delete<void>(`/organizations/${organizationId}`)
}
