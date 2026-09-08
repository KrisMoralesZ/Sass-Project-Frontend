import { QueryClientProvider } from '@tanstack/react-query'
import { type FC, type ReactNode, useEffect, useState } from 'react'
import { subscribeSessionCleared } from '@/features/auth/session-events'
import { createQueryClient } from './query-client'

export interface IAppQueryProvider {
  children: ReactNode
}

const AppQueryProvider: FC<IAppQueryProvider> = ({ children }) => {
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

export default AppQueryProvider
