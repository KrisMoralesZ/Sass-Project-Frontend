import { useMutation, useQueryClient } from '@tanstack/react-query'
import { register } from '../api/register'
import { applyAuthSessionResponse } from '../apply-auth-session'
import type { RegisterRequest } from '../auth-api.types'
import { useAuthSession } from '../useAuthSession'

export function useRegisterMutation(options?: {
  onAuthenticated?: () => void
}) {
  const queryClient = useQueryClient()
  const { establishSession } = useAuthSession()

  return useMutation({
    mutationFn: (body: RegisterRequest) => register(body),
    onSuccess: async (data) => {
      await applyAuthSessionResponse(queryClient, establishSession, data)
      options?.onAuthenticated?.()
    },
  })
}
