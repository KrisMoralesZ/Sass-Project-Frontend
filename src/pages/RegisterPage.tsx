import { type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import RegisterForm from '@/features/auth/components/RegisterForm'
import { useRegisterMutation } from '@/features/auth/hooks/use-register-mutation'
import { getApiErrorMessage } from '@/lib'
import { paths } from '@/routes/paths'

const RegisterPage: FC = () => {
  const navigate = useNavigate()

  const registerMutation = useRegisterMutation({
    onAuthenticated: () => {
      navigate(paths.home, { replace: true })
    },
  })

  return (
    <main>
      <RegisterForm
        isSubmitting={registerMutation.isPending}
        formError={
          registerMutation.isError
            ? getApiErrorMessage(registerMutation.error)
            : undefined
        }
        onSubmit={(values) => {
          registerMutation.mutate(values)
        }}
      />
    </main>
  )
}

export default RegisterPage
