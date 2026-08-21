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

export interface RegisterRequest {
  email: string
  password: string
  displayName?: string
}

export interface LoginRequest {
  email: string
  password: string
}

/** Mirrors backend `RegisterResponse` / `LoginResponse`. */
export interface AuthSessionResponse {
  user: AuthUserProfile
  tokens: AuthTokens
}

export type RegisterResponse = AuthSessionResponse

export type LoginResponse = AuthSessionResponse

export interface LogoutRequest {
  refreshToken: string
}

export interface LogoutResponse {
  message: string
}

export interface RefreshResponse {
  tokens: AuthTokens
}
