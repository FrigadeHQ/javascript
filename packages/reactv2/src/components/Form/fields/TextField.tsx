import { Box } from '@/components/Box'
import { Text } from '@/components/Text'

import { type FormFieldProps } from '..'
import { baseFieldStyle, baseInputStyle, errorInputStyle } from './BaseField.styles'

export function TextField({ field, fieldData, fieldState }: FormFieldProps) {
  const { id, placeholder, title } = fieldData
  const { error } = fieldState

  return (
    <Box {...baseFieldStyle}>
      <Text.Body2 as="label" htmlFor={id} fontWeight="demibold">
        {title}
        {fieldData.required && ' *'}
      </Text.Body2>
      {/* TODO: Add Text.Body2 styles back with component that can accept a ref */}
      <Box
        as="input"
        id={id}
        type="text"
        placeholder={placeholder}
        {...field}
        {...baseInputStyle}
        {...(error ? errorInputStyle : {})}
        value={field.value ?? ''}
      />
      {error?.message?.length > 0 && <Text.Caption color="red500">{error.message}</Text.Caption>}
    </Box>
  )
}
