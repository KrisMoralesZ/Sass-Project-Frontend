import { apiClient } from '@/lib'
import type {
  UpdateOrganizationRequest,
  UpdateOrganizationResponse,
} from './organization-api.types'

export function updateOrganization(
  organizationId: string,
  body: UpdateOrganizationRequest,
) {
  return apiClient.patch<UpdateOrganizationResponse>(
    `/organizations/${organizationId}`,
    body,
  )
}
