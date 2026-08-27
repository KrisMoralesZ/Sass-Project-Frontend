import {
  Children,
  cloneElement,
  type FC,
  type ReactElement,
  type ReactNode,
  useId,
  isValidElement,
} from 'react'
import { $Error, $Hint, $Label, $Required, $Root } from './FormField.sc'

export interface IFormField {
  label: ReactNode
  htmlFor?: string
  hint?: ReactNode
  error?: ReactNode
  required?: boolean
  children: ReactNode
}

type FieldControlProps = {
  id?: string
  error?: boolean
  'aria-describedby'?: string
  'aria-required'?: boolean | 'true' | 'false'
}

const FormField: FC<IFormField> = ({
  label,
  htmlFor,
  hint,
  error,
  required = false,
  children,
}) => {
  const generatedId = useId()
  const fieldId = htmlFor ?? generatedId
  const hintId = `${fieldId}-hint`
  const errorId = `${fieldId}-error`
  const describedBy = error ? errorId : hint ? hintId : undefined
  const hasError = Boolean(error)

  const control = Children.map(children, (child) => {
    if (!isValidElement(child)) {
      return child
    }

    const element = child as ReactElement<FieldControlProps>
    const existingDescribedBy = element.props['aria-describedby']

    return cloneElement(element, {
      id: element.props.id ?? fieldId,
      error: hasError || element.props.error,
      'aria-required': required || element.props['aria-required'],
      'aria-describedby':
        [existingDescribedBy, describedBy].filter(Boolean).join(' ') ||
        undefined,
    })
  })

  return (
    <$Root>
      <$Label htmlFor={fieldId}>
        {label}
        {required ? <$Required aria-hidden="true">*</$Required> : null}
      </$Label>
      {control}
      {error ? (
        <$Error id={errorId} role="alert">
          {error}
        </$Error>
      ) : hint ? (
        <$Hint id={hintId}>{hint}</$Hint>
      ) : null}
    </$Root>
  )
}

export default FormField
