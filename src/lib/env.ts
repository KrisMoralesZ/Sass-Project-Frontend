/**
 * Reads Vite-exposed environment variables.
 * Only `VITE_*` keys are available in the browser.
 */
export function getApiBaseUrl(): string {
  const value = import.meta.env.VITE_API_URL

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(
      'Missing VITE_API_URL. Copy .env.example to .env and set the backend origin.',
    )
  }

  return value.replace(/\/$/, '')
}
