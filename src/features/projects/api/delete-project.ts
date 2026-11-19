import { apiClient } from '@/lib/api/api-client'

/** `DELETE /projects/:id` — soft-archives the project (204). */
export function deleteProject(projectId: string) {
  return apiClient.delete<void>(`/projects/${projectId}`)
}
