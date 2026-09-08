import { apiClient } from '@/lib/api/api-client'

/** `DELETE /organizations/:id` — soft-archives the workspace (204). */
export function archiveOrganization(organizationId: string) {
  return apiClient.delete<void>(`/organizations/${organizationId}`)
}
