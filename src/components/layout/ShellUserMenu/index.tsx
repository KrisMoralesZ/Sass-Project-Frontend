import { type FC } from 'react'
import type { AuthUserProfile } from '@/features/auth/auth-api.types'
import { useAuthSession } from '@/features/auth/useAuthSession'
import { paths } from '@/routes/paths'
import {
  $ProfileLink,
  $UserLabel,
  $UserMenu,
  $UserMeta,
} from './ShellUserMenu.sc'

function getShellUserPrimaryLabel(user: AuthUserProfile): string {
  const trimmedDisplayName = user.displayName?.trim()
  return trimmedDisplayName || user.email
}

/**
 * Sidebar account menu for the authenticated shell (task 3.1.6).
 * Reads the auth session display name so profile saves update the shell
 * without a reload.
 */
const ShellUserMenu: FC = () => {
  const { user } = useAuthSession()

  if (!user) {
    return null
  }

  const primaryLabel = getShellUserPrimaryLabel(user)
  const showEmailMeta =
    Boolean(user.displayName?.trim()) && user.email !== primaryLabel

  return (
    <$UserMenu aria-label="Account">
      <$UserLabel title={primaryLabel}>{primaryLabel}</$UserLabel>
      {showEmailMeta ? (
        <$UserMeta title={user.email}>{user.email}</$UserMeta>
      ) : null}
      <$ProfileLink to={paths.profile} end>
        Profile
      </$ProfileLink>
    </$UserMenu>
  )
}

export default ShellUserMenu
