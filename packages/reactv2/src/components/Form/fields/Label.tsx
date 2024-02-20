import { Text } from '@/components/Text'

export function Label({ children, id, required = false }) {
  return (
    <Text.H4 as="label" htmlFor={id} part="field-label">
      {children}
      {required && ' *'}
    </Text.H4>
  )
}
