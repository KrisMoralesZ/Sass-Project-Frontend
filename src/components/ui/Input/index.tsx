import { type FC, type InputHTMLAttributes } from 'react'
import { $Input, type InputSize } from './Input.sc'

export type { InputSize }

export interface IInput extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  size?: InputSize
  fullWidth?: boolean
  error?: boolean
}

const Input: FC<IInput> = ({
  size = 'md',
  fullWidth = false,
  error = false,
  disabled,
  type = 'text',
  ...rest
}) => {
  return (
    <$Input
      $size={size}
      $fullWidth={fullWidth}
      $error={error}
      type={type}
      disabled={disabled}
      aria-invalid={error || undefined}
      {...rest}
    />
  )
}

export default Input
