import { Text } from '@/components/Text'

export function Error({ error }) {
  if (!error?.message?.length) {
    return null
  }

  return (
    <Text.Caption color="red500" display="block" textAlign="end">
      {error?.message}
    </Text.Caption>
  )
}
