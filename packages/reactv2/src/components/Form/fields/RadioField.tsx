import * as React from 'react'
import * as RadioGroup from '@radix-ui/react-radio-group'

import { Box } from '@/components/Box'
import { Flex } from '@/components/Flex/Flex'
import { Text } from '@/components/Text'

import { type FormFieldProps } from '..'
import { BaseField } from './BaseField'

export interface SelectItemProps {
  label: string
  value: any
}

const RadioItem = React.forwardRef<HTMLButtonElement, SelectItemProps>(
  ({ label, value }, forwardedRef) => (
    <Box
      as="label"
      htmlFor={value}
      display="flex"
      justifyContent="space-between"
      px={4}
      py={2}
      borderWidth="md"
      borderStyle="solid"
      borderColor="neutral.border"
      borderRadius="md"
    >
      <Text.Body2>{label}</Text.Body2>

      <RadioGroup.Item id={value} value={value} ref={forwardedRef} asChild>
        <Box
          as="button"
          backgroundColor="neutral.background"
          borderWidth="md"
          borderStyle="solid"
          borderColor="neutral.border"
          borderRadius="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding="0"
          height="24px"
          width="24px"
        >
          <Box
            as={RadioGroup.Indicator}
            backgroundColor="pink"
            borderRadius="100%"
            display="block"
            height="12px"
            width="12px"
          />
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
        <RadioGroup.Root value={value} onValueChange={onChange}>
          <Flex.Column gap={2}>{radioItems}</Flex.Column>
        </RadioGroup.Root>
      )}
    </BaseField>
  )
}
