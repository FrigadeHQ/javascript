import { Text } from '@/components/Text'
import React from 'react'
import { Box } from '@/components/Box'

export function Label({ children, id, required = false }) {
  return (
    <Text.Body2
      as="label"
      htmlFor={id}
      part="field-label"
      fontWeight="medium"
      mb="2"
      display="block"
    >
      {children}
      <Box part="field-label-required" display="inline">
        {required && '*'}
      </Box>
    </Text.Body2>
  )
}
