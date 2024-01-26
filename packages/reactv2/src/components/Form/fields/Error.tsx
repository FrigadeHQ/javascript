import { type FieldError } from 'react-hook-form'

import { Text } from '@/components/Text'

export interface ErrorProps {
  error: FieldError
}

export function Error({ error }: ErrorProps) {
  if (!error?.message?.length) {
    return null
  }

  return (
    <Text.Caption color="red500" display="block" textAlign="end">
      {error?.message}
    </Text.Caption>
  )
}
