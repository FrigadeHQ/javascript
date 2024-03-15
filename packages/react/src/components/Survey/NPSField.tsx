import { Button } from '@/components/Button'
import { Flex } from '@/components/Flex'
import { FormFieldProps } from '@/components/Form'

export function NPSField({ field, submit }: FormFieldProps) {
  const buttons = [...Array(11)].map((_, i) => {
    const Component = field.value === i ? Button.Primary : Button.Secondary
    return (
      <Component
        borderWidth="1px"
        key={i}
        onClick={() => {
          field.onChange(i)
          submit()
        }}
        title={`${i}`}
      />
    )
  })
  return (
    <Flex.Row gap={2} justifyContent="space-between" part="field-nps">
      {buttons}
    </Flex.Row>
  )
}
