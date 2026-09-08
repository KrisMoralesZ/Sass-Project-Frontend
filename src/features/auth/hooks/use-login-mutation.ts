import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login } from '../api/login'
import { applyAuthSessionResponse } from '../apply-auth-session'
import type { LoginRequest } from '../auth-api.types'
import { useAuthSession } from '../useAuthSession'

export function useLoginMutation(options?: { onAuthenticated?: () => void }) {
  const queryClient = useQueryClient()
  const { establishSession } = useAuthSession()

  return useMutation({
    mutationFn: (body: LoginRequest) => login(body),
    onSuccess: async (data) => {
      await applyAuthSessionResponse(queryClient, establishSession, data)
      options?.onAuthenticated?.()
    },
  })
}
