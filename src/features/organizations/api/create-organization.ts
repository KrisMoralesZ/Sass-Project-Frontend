import { apiClient } from '@/lib/api/api-client'
import type {
  CreateOrganizationRequest,
  CreateOrganizationResponse,
} from './organization-api.types'

export function createOrganization(body: CreateOrganizationRequest) {
  return apiClient.post<CreateOrganizationResponse>('/organizations', body)
}
