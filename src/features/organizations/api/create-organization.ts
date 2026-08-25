import { apiClient } from '@/lib'
import type {
  CreateOrganizationRequest,
  CreateOrganizationResponse,
} from './organization-api.types'

export function createOrganization(body: CreateOrganizationRequest) {
  return apiClient.post<CreateOrganizationResponse>('/organizations', body)
}
