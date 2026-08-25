import { QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useEffect, useState } from 'react'
import { subscribeSessionCleared } from '@/features/auth/session-events'
import { createQueryClient } from './query-client'

export function AppQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createQueryClient())

  useEffect(() => {
    return subscribeSessionCleared(() => {
      void queryClient.invalidateQueries({
        queryKey: ['auth'],
        refetchType: 'none',
      })
    })
  }, [queryClient])

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
