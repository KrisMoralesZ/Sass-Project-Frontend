import { apiClient } from '@/lib'

export function archiveOrganization(organizationId: string) {
  return apiClient.delete<void>(`/organizations/${organizationId}`)
}
