import { Text } from '@/components/Text'

export function Label({ children, id, required = false }) {
  return (
    <Text.Body2 as="label" htmlFor={id} fontWeight="demibold">
      {children}
      {required && ' *'}
    </Text.Body2>
  )
}
