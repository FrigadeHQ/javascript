import { Text } from '@/components/Text'

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
      {required && '*'}
    </Text.Body2>
  )
}
