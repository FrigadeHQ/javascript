import * as React from 'react'
import * as RadioGroup from '@radix-ui/react-radio-group'

import { Box } from '@/components/Box'
import { Flex } from '@/components/Flex'
import { Text } from '@/components/Text'

import { type FormFieldProps } from '..'
import { BaseField } from './BaseField'
import { CheckIcon } from '@/components/Icon/CheckIcon'
import * as baseStyles from '@/components/Form/fields/BaseField.styles'

export interface SelectItemProps {
  label: string
  value: string
}

const RadioItem = React.forwardRef<HTMLButtonElement, SelectItemProps>(
  ({ label, value }, forwardedRef) => (
    <Box
      as="label"
      backgroundColor="neutral.background"
      borderColor="neutral.border"
      borderRadius="md"
      borderStyle="solid"
      borderWidth="md"
      display="flex"
      htmlFor={value}
      justifyContent="space-between"
      part="field-radio"
      px={4}
      py={2}
    >
      <Text.Body2 part="field-radio-label">{label}</Text.Body2>

      <RadioGroup.Item id={value} value={value} ref={forwardedRef} asChild>
        <Box
          as="button"
          backgroundColor="inherit"
          borderWidth="md"
          borderStyle="solid"
          borderColor="neutral.border"
          borderRadius="100%"
          padding="0"
          part="field-radio-value"
          position="relative"
          height="24px"
          width="24px"
        >
          <Box as={RadioGroup.Indicator} {...baseStyles.checkContainer}>
            <CheckIcon height="14" width="14" />
          </Box>
        </Box>
      </RadioGroup.Item>
    </Box>
  )
)

export function RadioField(props: FormFieldProps) {
  const {
    field: { onChange, value },
    fieldData: { options = [] },
  } = props

  const radioItems = options.map(({ label, value }) => (
    <RadioItem key={value} value={value} label={label} />
  ))

  return (
    <BaseField {...props}>
      {() => (
        <RadioGroup.Root value={value} onValueChange={onChange} asChild>
          <Flex.Column gap={2} part="field-radio-group">
            {radioItems}
          </Flex.Column>
        </RadioGroup.Root>
      )}
    </BaseField>
  )
}
