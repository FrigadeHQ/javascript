import * as React from 'react'
import * as Select from '@radix-ui/react-select'

import { Box } from '@/components/Box'
import { Text } from '@/components/Text'

import { type FormFieldProps } from '..'
import { baseFieldStyle, baseInputStyle } from './BaseField.styles'

export interface SelectItemProps {
  label: string
  value: any
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ label, value }, forwardedRef) => (
    <Select.Item value={value} ref={forwardedRef}>
      <Select.ItemText>
        <Text.Body2>{label}</Text.Body2>
      </Select.ItemText>
    </Select.Item>
  )
)

export function SelectField({ field, fieldData }: FormFieldProps) {
  const { id, options = [], placeholder, title } = fieldData
  const selectItems = options.map(({ label, value }) => (
    <SelectItem key={value} value={value} label={label} />
  ))

  return (
    <Box {...baseFieldStyle}>
      <Text.Body2 fontWeight="demibold">{title}</Text.Body2>
      <Select.Root value={field.value} onValueChange={field.onChange}>
        <Select.Trigger asChild>
          <Box {...baseInputStyle}>
            <Select.Value placeholder={placeholder ?? 'Select one'} />
          </Box>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content asChild>
            <Box {...baseInputStyle}>
              <Select.Viewport>{selectItems}</Select.Viewport>
            </Box>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </Box>
  )
}
