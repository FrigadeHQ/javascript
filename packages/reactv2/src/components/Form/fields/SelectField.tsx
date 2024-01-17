import * as React from 'react'
import * as Select from '@radix-ui/react-select'

import { Box } from '@/components/Box'
import { Text } from '@/components/Text'

import { type FormField } from '..'
import { baseFieldStyle, baseInputStyle } from './BaseField.styles'

const SelectItem = React.forwardRef(({ label, value }, forwardedRef) => (
  <Select.Item value={value} ref={forwardedRef}>
    <Select.ItemText>
      <Text.Body2>{label}</Text.Body2>
    </Select.ItemText>
  </Select.Item>
))

export function SelectField({ id, options = [], title }: FormField) {
  const selectItems = options.map(({ label, value }) => (
    <SelectItem key={value} value={value} label={label} />
  ))

  return (
    <Box {...baseFieldStyle}>
      <Text.Body2 as="label" htmlFor={id} fontWeight="demibold">
        {title}
      </Text.Body2>
      <Select.Root>
        <Select.Trigger asChild>
          <Box {...baseInputStyle}>
            <Select.Value placeholder="Open sesame" />
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
