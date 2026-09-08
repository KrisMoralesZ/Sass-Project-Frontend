/** Mirrors `sass-backend` authentication password constants. */
export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 72

export const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/

export const PASSWORD_HINT =
  '8–72 characters with at least one uppercase letter, one lowercase letter, and one number'

export const PASSWORD_VALIDATION_MESSAGE =
  'Password must contain at least one uppercase letter, one lowercase letter, and one number'

export function getPasswordError(password: string): string | null {
  if (!password) {
    return 'Password is required'
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Password must be at most ${PASSWORD_MAX_LENGTH} characters`
  }

  if (!PASSWORD_PATTERN.test(password)) {
    return PASSWORD_VALIDATION_MESSAGE
  }

  return null
}
