import * as React from 'react'
import * as Select from '@radix-ui/react-select'

import { Box } from '@/components/Box'
import { Text } from '@/components/Text'

import { type FormFieldProps } from '..'
import { BaseField } from './BaseField'
import * as baseStyles from './BaseField.styles'

export interface SelectItemProps {
  label: string
  value: any
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ label, value }, forwardedRef) => (
    <Select.Item value={value} ref={forwardedRef} style={{ outline: 'none' }}>
      <Select.ItemText>
        <Text.Body2>{label}</Text.Body2>
      </Select.ItemText>
    </Select.Item>
  )
)

export function SelectField(props: FormFieldProps) {
  // TODO: Label doesn't open select automatically. Need to wire that in.
  const {
    field: { onChange, value },
    fieldData: { options = [], placeholder },
    fieldState: { error },
  } = props

  const selectItems = options.map(({ label, value }) => (
    <SelectItem key={value} value={value} label={label} />
  ))

  return (
    <BaseField {...props}>
      {() => (
        <Select.Root value={value} onValueChange={onChange}>
          <Select.Trigger asChild>
            <Box {...baseStyles.input} {...(error ? baseStyles.error : {})}>
              <Select.Value placeholder={placeholder ?? 'Select one'} />
            </Box>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content position="popper" asChild>
              <Box {...baseStyles.input}>
                <Select.Viewport>{selectItems}</Select.Viewport>
              </Box>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      )}
    </BaseField>
  )
}
