import { Box } from '@/components/Box'

import { type FormFieldProps } from '..'
import { Error } from './Error'
import { Label } from './Label'
import * as styles from './BaseField.styles'

export interface FieldProps {
  value: string
  onChange: (value: string) => void
  [key: string]: unknown
}

interface BaseFieldProps extends FormFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Tighten up fieldProps type
  children: (fieldProps?: FieldProps) => React.ReactNode
}

export function BaseField({ children, field, fieldData, fieldState }: BaseFieldProps) {
  const { id, label, placeholder, props } = fieldData
  const { error } = fieldState

  const fieldProps = {
    id,
    ...field,
    ...(placeholder ? { placeholder } : {}),
    ...styles.input,
    'aria-invalid': !!error,
    value: field.value ?? '',
    ...props,
  }

  return (
    <Box part="field">
      <Label id={id} required={!!fieldData.required}>
        {label}
      </Label>

      {children(fieldProps)}

      <Error error={error} />
    </Box>
  )
}
