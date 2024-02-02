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

// NOTE: This isn't quite exactly the same as the HeroIcons checkmark
const CheckIcon = () => (
  <Box as="svg" color="primary.foreground" width="10px" height="8px" viewBox="0 0 10 8" fill="none">
    <path
      d="M1 4.34664L3.4618 6.99729L3.4459 6.98017L9 1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Box>
)

const RadioItem = React.forwardRef<HTMLButtonElement, SelectItemProps>(
  ({ label, value }, forwardedRef) => (
    <Box
      as="label"
      htmlFor={value}
      display="flex"
      justifyContent="space-between"
      part="field-radio"
      px={4}
      py={2}
      borderWidth="md"
      borderStyle="solid"
      borderColor="neutral.border"
      borderRadius="md"
    >
      <Text.Body2 part="field-radio-label">{label}</Text.Body2>

      <RadioGroup.Item id={value} value={value} ref={forwardedRef} asChild>
        <Box
          as="button"
          backgroundColor="neutral.background"
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
          <Box
            as={RadioGroup.Indicator}
            alignItems="center"
            bg="primary.surface"
            borderWidth="md"
            borderStyle="solid"
            borderColor="primary.border"
            borderRadius="100%"
            display="flex"
            height="calc(100% + 2px)"
            justifyContent="center"
            left="-1px"
            part="field-radio-indicator"
            position="absolute"
            top="-1px"
            width="calc(100% + 2px)"
          >
            <CheckIcon />
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
