import * as React from 'react'

import { type FormFieldProps } from '..'
import { BaseField } from './BaseField'
import { Flex } from '@/components/Flex'
import * as Checkbox from '@radix-ui/react-checkbox'
import { Box } from '@/components/Box'
import { CheckIcon } from '@/components/Icon/CheckIcon'
import { Text } from '@/components/Text'
import * as baseStyles from '@/components/Form/fields/BaseField.styles'

export function SelectMultipleField(props: FormFieldProps) {
  const {
    field: { onChange, value },
    fieldData: { options = [] },
  } = props

  // Ensure we always work with an array of strings coming from RHF
  const valueArray: string[] = Array.isArray(value) ? value : []

  function toggleValue(optionValue: string) {
    const updatedValueArray = valueArray.includes(optionValue)
      ? valueArray.filter((v) => v !== optionValue)
      : [...valueArray, optionValue]

    // Let react-hook-form handle the new value
    onChange(updatedValueArray)
  }

  return (
    <BaseField {...props}>
      {() => (
        <Flex.Column gap={2} part="field-select-multiple">
          {options.map(({ label, value: optionValue }) => (
            <Checkbox.Root
              key={optionValue}
              checked={valueArray.includes(optionValue)}
              onCheckedChange={() => toggleValue(optionValue)}
              asChild
            >
              <Box
                as="button"
                backgroundColor="neutral.background"
                borderColor="neutral.border"
                borderRadius="md"
                borderStyle="solid"
                borderWidth="md"
                display="flex"
                justifyContent="space-between"
                part="field-check"
                px={4}
                py={2}
              >
                <Text.Body2 part="field-check-label">{label}</Text.Body2>

                <Box
                  backgroundColor="inherit"
                  borderWidth="md"
                  borderStyle="solid"
                  borderColor="neutral.border"
                  borderRadius="100%"
                  flex="0 0 auto"
                  id={optionValue}
                  padding="0"
                  part="field-check-value"
                  position="relative"
                  height="24px"
                  width="24px"
                >
                  <Checkbox.Indicator asChild>
                    <Box {...baseStyles.checkContainer}>
                      <CheckIcon height="14" width="14" />
                    </Box>
                  </Checkbox.Indicator>
                </Box>
              </Box>
            </Checkbox.Root>
          ))}
        </Flex.Column>
      )}
    </BaseField>
  )
}
