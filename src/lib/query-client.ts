import { QueryClient } from '@tanstack/react-query'

/**
 * Shared QueryClient for the SPA.
 * Feature modules should use hooks against this client via QueryClientProvider.
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Avoid surprise refetches while building the client layer.
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  })
}
