import { isApiError } from '@/lib/api/api-error'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { ErrorCode } from '@/types/error-code'

/** User-facing copy for `DELETE /organizations/:id` failures (task 2.3.4). */
export function describeOrganizationArchiveError(error: unknown): string {
  if (!isApiError(error)) {
    return getApiErrorMessage(error)
  }

  switch (error.code) {
    case ErrorCode.FORBIDDEN:
      return 'Only the workspace owner can archive this workspace.'
    case ErrorCode.TENANT_ORGANIZATION_FORBIDDEN:
      return 'You do not have access to this workspace. Choose another workspace in the sidebar and try again.'
    case ErrorCode.TENANT_ORGANIZATION_REQUIRED:
      return 'Select a workspace to archive it.'
    case ErrorCode.RESOURCE_NOT_FOUND:
      return 'This workspace is no longer available. It may already have been archived.'
    default:
      return getApiErrorMessage(error)
  }
}
