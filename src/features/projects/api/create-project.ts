import { apiClient } from '@/lib/api/api-client'
import type {
  CreateProjectRequest,
  CreateProjectResponse,
} from './project-api.types'

export function createProject(body: CreateProjectRequest) {
  return apiClient.post<CreateProjectResponse>('/projects', body)
}
