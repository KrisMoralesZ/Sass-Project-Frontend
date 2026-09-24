import { isApiError } from '@/lib/api/api-error'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { ErrorCode } from '@/types/error-code'

export interface MembersLoadError {
  title: string
  message: string
}

export type MembersErrorSubject = 'member' | 'members'

function fallbackTitle(subject: MembersErrorSubject): string {
  return subject === 'member'
    ? 'Member details could not be loaded'
    : 'Members could not be loaded'
}

/**
 * User-facing copy for `GET /members` / `GET /members/:userId` failures
 * (task 3.2.5). Mirrors `describeOrganizationWorkspaceLoadError` so tenant,
 * forbidden, and not-found cases read consistently across the members screens.
 */
export function describeMembersLoadError(
  error: unknown,
  subject: MembersErrorSubject = 'members',
): MembersLoadError {
  if (!isApiError(error)) {
    return {
      title: fallbackTitle(subject),
      message: getApiErrorMessage(error),
    }
  }

  switch (error.code) {
    case ErrorCode.TENANT_ORGANIZATION_REQUIRED:
      return {
        title: 'Select a workspace',
        message:
          subject === 'member'
            ? 'Choose a workspace in the sidebar to inspect a member.'
            : 'Choose a workspace in the sidebar to view its members.',
      }
    case ErrorCode.TENANT_ORGANIZATION_FORBIDDEN:
      return {
        title: 'This workspace is unavailable',
        message:
          'You do not have access to this workspace. Choose another workspace in the sidebar.',
      }
    case ErrorCode.RESOURCE_NOT_FOUND:
      return subject === 'member'
        ? {
            title: 'Member not found',
            message: 'This member may have left the workspace or been removed.',
          }
        : {
            title: 'This workspace is no longer available',
            message:
              'It may have been archived or deleted. Switch to another workspace to continue.',
          }
    case ErrorCode.FORBIDDEN:
      return {
        title:
          subject === 'member'
            ? 'You cannot view this member'
            : 'You cannot view these members',
        message:
          'You do not have permission to view this workspace. Ask an admin to update your role.',
      }
    default:
      return {
        title: fallbackTitle(subject),
        message: getApiErrorMessage(error),
      }
  }
}
