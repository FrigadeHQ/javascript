import * as React from 'react'
import * as Select from '@radix-ui/react-select'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

import { Box } from '@/components/Box'
import { Text } from '@/components/Text'

import { type FormFieldProps } from '..'
import { BaseField } from './BaseField'
import * as baseStyles from './BaseField.styles'

export interface SelectItemProps {
  label: string
  value: string
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ label, value }, forwardedRef) => (
    <Select.Item value={value} ref={forwardedRef} asChild>
      <Box
        backgroundColor:hover="blue900"
        borderRadius="md"
        outline="none"
        part="field-select-option"
        px="3"
        py="2"
      >
        <Select.ItemText asChild>
          <Text.Body2 part="field-select-option-label">{label}</Text.Body2>
        </Select.ItemText>
      </Box>
    </Select.Item>
  )
)

export function SelectField(props: FormFieldProps) {
  // TODO: Label doesn't open select automatically. Need to wire that in.
  const {
    field: { onChange, value },
    fieldData: { options = [], placeholder },
  } = props

  const selectItems = options.map(({ label, value }) => (
    <SelectItem key={value} value={value} label={label} />
  ))

  return (
    <BaseField {...props}>
      {() => (
        <Select.Root value={value} onValueChange={onChange}>
          <Select.Trigger asChild>
            <Text.Body2
              {...baseStyles.input}
              alignItems="center"
              display="flex"
              justifyContent="space-between"
              part="field-select"
            >
              <Select.Value placeholder={placeholder ?? 'Select one'} />

              <Select.Icon>
                <Box
                  as={ChevronDownIcon}
                  color="gray100"
                  display="block"
                  height="24px"
                  part="field-select-icon"
                  width="24px"
                />
              </Select.Icon>
            </Text.Body2>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content position="popper" sideOffset={4} asChild>
              <Box
                {...baseStyles.input}
                p="1"
                part="field-select-options"
                width="var(--radix-popper-anchor-width)"
              >
                <Select.Viewport>{selectItems}</Select.Viewport>
              </Box>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      )}
    </BaseField>
  )
}
