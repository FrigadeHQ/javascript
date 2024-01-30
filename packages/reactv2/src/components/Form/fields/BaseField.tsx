import { Box } from '@/components/Box'

import { type FormFieldProps } from '..'
import { Error } from './Error'
import { Label } from './Label'
import * as styles from './BaseField.styles'

interface BaseFieldProps extends FormFieldProps {
  // TODO: Tighten up fieldProps type
  children: (fieldProps?: any) => React.ReactNode
}

export function BaseField({ children, field, fieldData, fieldState }: BaseFieldProps) {
  const { id, label, placeholder } = fieldData
  const { error } = fieldState

  const fieldProps = {
    id,
    ...field,
    ...(placeholder ? { placeholder } : {}),
    ...styles.input,
    'aria-invalid': !!error,
    value: field.value ?? '',
  }

  return (
    <Box {...styles.field} part="field">
      <Label id={id} required={!!fieldData.required}>
        {label}
      </Label>

      {children(fieldProps)}

      <Error error={error} />
    </Box>
  )
}
