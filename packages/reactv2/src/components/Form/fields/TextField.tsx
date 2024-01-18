import { Box } from '@/components/Box'
import { Text } from '@/components/Text'

import { type FormFieldProps } from '..'
import { baseFieldStyle, baseInputStyle } from './BaseField.styles'

export function TextField({ field, fieldData }: FormFieldProps) {
  const { id, placeholder, title } = fieldData
  return (
    <Box {...baseFieldStyle}>
      <Text.Body2 as="label" htmlFor={id} fontWeight="demibold">
        {title}
      </Text.Body2>
      {/* TODO: Add Text.Body2 styles back with component that can accept a ref */}
      <Box
        as="input"
        id={id}
        type="text"
        placeholder={placeholder}
        {...field}
        {...baseInputStyle}
        value={field.value ?? ''}
      />
    </Box>
  )
}
