import { type FC, useState } from 'react'
import Button from '@/components/ui/Button'
import Toast from '@/components/ui/Toast'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { useAuthSession } from '@/features/auth/useAuthSession'
import ProfileForm from '@/features/users/components/ProfileForm'
import { useMyProfile } from '@/features/users/hooks/use-my-profile'
import { useUpdateMyProfile } from '@/features/users/hooks/use-update-my-profile'
import {
  $ErrorPanel,
  $ErrorTitle,
  $Eyebrow,
  $Header,
  $Lead,
  $Message,
  $Page,
  $Title,
} from './ProfilePage.sc'

/**
 * Profile settings screen for the signed-in user (task 3.1.3).
 * User-scoped: works without an active workspace.
 */
const ProfilePage: FC = () => {
  const { user } = useAuthSession()
  const profileQuery = useMyProfile()
  const updateProfileMutation = useUpdateMyProfile()
  const [isSavedToastOpen, setIsSavedToastOpen] = useState(false)

  const header = (
    <$Header>
      <$Eyebrow>Account</$Eyebrow>
      <$Title>Profile settings</$Title>
      <$Lead>
        Update how you appear in the product and tune your personal defaults.
      </$Lead>
    </$Header>
  )

  if (profileQuery.isPending) {
    return (
      <$Page>
        {header}
        <$Message>Loading profile...</$Message>
      </$Page>
    )
  }

  if (profileQuery.isError) {
    return (
      <$Page>
        {header}
        <$ErrorPanel role="alert">
          <$ErrorTitle>Could not load profile</$ErrorTitle>
          <$Message>{getApiErrorMessage(profileQuery.error)}</$Message>
          <Button type="button" onClick={() => void profileQuery.refetch()}>
            Try again
          </Button>
        </$ErrorPanel>
      </$Page>
    )
  }

  const profile = profileQuery.data
  const email = profile.email || user?.email || ''

  return (
    <$Page>
      {header}
      <ProfileForm
        profile={profile}
        email={email}
        onSubmit={(body) => {
          updateProfileMutation.mutate(body, {
            onSuccess: () => {
              setIsSavedToastOpen(true)
            },
          })
        }}
        isSubmitting={updateProfileMutation.isPending}
        apiError={
          updateProfileMutation.isError ? updateProfileMutation.error : undefined
        }
      />
      <Toast
        open={isSavedToastOpen}
        onClose={() => setIsSavedToastOpen(false)}
        variant="success"
        title="Profile saved"
      >
        Your profile preferences were updated.
      </Toast>
    </$Page>
  )
}

export default ProfilePage
