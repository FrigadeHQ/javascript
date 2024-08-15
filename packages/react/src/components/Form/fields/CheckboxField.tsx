import * as React from 'react'
import * as Checkbox from '@radix-ui/react-checkbox'

import { Box } from '@/components/Box'
import { Text } from '@/components/Text'

import { type FormFieldProps } from '..'
import { CheckIcon } from '@/components/Icon/CheckIcon'
import * as baseStyles from '@/components/Form/fields/BaseField.styles'

export function CheckboxField(props: FormFieldProps) {
  const {
    field: { onChange, value },
    fieldData: { options, label, id = [] },
  } = props

  return (
    <Box part="field" display="flex" gap={2} alignItems="center">
      <Checkbox.Root
        defaultChecked
        onCheckedChange={onChange}
        value={value}
        checked={value === true}
        asChild
      >
        <Box
          {...baseStyles.box}
          as="button"
          width="25px"
          minWidth="25px"
          height="25px"
          justifyContent="center"
          alignItems="center"
          display="flex"
          // @ts-ignore
          backgroundColor:hover="neutral.900"
          part="field-checkbox"
          id={id as string}
        >
          <Checkbox.Indicator asChild>
            <Box
              width="20px"
              height="20px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <CheckIcon height="14" fill="currentColor" />
            </Box>
          </Checkbox.Indicator>
        </Box>
      </Checkbox.Root>
      <Text.Body2 part="field-checkbox-label" as="label" htmlFor={id}>
        {label}
      </Text.Body2>
    </Box>
  )
}
