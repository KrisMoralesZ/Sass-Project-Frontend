/**
 * Reads Vite-exposed environment variables.
 * Only `VITE_*` keys are available in the browser.
 */

const API_VERSION_PATH = '/api/v1'

/**
 * Backend origin from `VITE_API_URL` (e.g. `http://localhost:3000`),
 * normalized without a trailing slash.
 */
export function getApiBaseUrl(): string {
  const value = import.meta.env.VITE_API_URL

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(
      'Missing VITE_API_URL. Copy .env.example to .env and set the backend origin.',
    )
  }

  const normalized = value.trim().replace(/\/+$/, '')

  try {
    new URL(normalized)
  } catch {
    throw new Error(
      `Invalid VITE_API_URL "${value}". Expected an absolute URL like http://localhost:3000.`,
    )
  }

  return normalized
}

/**
 * Versioned API base (`{VITE_API_URL}/api/v1`) per the backend contract.
 * All API requests should be built from this URL.
 */
export function getApiUrl(): string {
  return `${getApiBaseUrl()}${API_VERSION_PATH}`
}
