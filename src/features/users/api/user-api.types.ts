export const USER_PROFILE_THEMES = ['system', 'light', 'dark'] as const

export type UserProfileTheme = (typeof USER_PROFILE_THEMES)[number]

/** Mirrors backend `UserProfileNotificationPreferences`. */
export interface UserProfileNotificationPreferences {
  email: boolean
  inApp: boolean
  marketing: boolean
}

/** Mirrors backend `UserProfilePreferences` (always fully populated in responses). */
export interface UserProfilePreferences {
  timezone: string
  locale: string
  theme: UserProfileTheme
  notifications: UserProfileNotificationPreferences
}

/** Mirrors backend `UserProfileResponse` (dates as ISO strings). */
export interface UserProfile {
  id: string
  userId: string
  email: string
  displayName: string | null
  avatarUrl: string | null
  preferences: UserProfilePreferences
  createdAt: string
  updatedAt: string
}

/** Mirrors backend `UserProfileNotificationPreferencesDto`: every field optional. */
export interface UserProfileNotificationPreferencesPatch {
  email?: boolean
  inApp?: boolean
  marketing?: boolean
}

/** Mirrors backend `UserProfilePreferencesDto`: every field optional. */
export interface UserProfilePreferencesPatch {
  timezone?: string
  locale?: string
  theme?: UserProfileTheme
  notifications?: UserProfileNotificationPreferencesPatch
}

/** Mirrors backend `UpdateUserProfileDto`. */
export interface UpdateUserProfileRequest {
  displayName?: string | null
  avatarUrl?: string | null
  preferences?: UserProfilePreferencesPatch
}

export type UpdateUserProfileResponse = UserProfile
