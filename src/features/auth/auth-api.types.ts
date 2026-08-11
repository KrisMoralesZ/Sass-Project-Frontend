export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface RefreshResponse {
  tokens: AuthTokens
}
