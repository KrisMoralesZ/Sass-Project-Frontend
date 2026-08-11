export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface AuthUserProfile {
  id: string
  email: string
  displayName: string | null
  /** ISO string from the API JSON envelope. */
  createdAt: string
}

export interface RefreshResponse {
  tokens: AuthTokens
}
