import { apiClient } from '@/lib/api/api-client'
import type {
  UpdateProjectRequest,
  UpdateProjectResponse,
} from './project-api.types'

export function updateProject(
  projectId: string,
  body: UpdateProjectRequest,
) {
  return apiClient.patch<UpdateProjectResponse>(
    `/projects/${projectId}`,
    body,
  )
}
