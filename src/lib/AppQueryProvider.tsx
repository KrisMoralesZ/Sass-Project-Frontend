import { QueryClientProvider } from '@tanstack/react-query'
import { type FC, type ReactNode, useState } from 'react'
import { createQueryClient } from './query-client'

export interface IAppQueryProvider {
  children: ReactNode
}

const AppQueryProvider: FC<IAppQueryProvider> = ({ children }) => {
  const [queryClient] = useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export default AppQueryProvider
