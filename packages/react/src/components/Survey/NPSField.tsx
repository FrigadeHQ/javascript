import { Button } from '@/components/Button'
import { Flex } from '@/components/Flex'
import { FormFieldProps } from '@/components/Form'
import { Text } from '@/components/Text'

export function NPSField({ field, fieldData, submit }: FormFieldProps) {
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
        css={{
          '.fr-button-title': {
            fontSize: '15px',
          },
        }}
      />
    )
  })
  return (
    <Flex.Column gap={2}>
      <Flex.Row
        gap={2}
        part="field-nps"
        css={{
          '@media (min-width: 660px)': {
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
          },
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {buttons}
      </Flex.Row>
      <Flex.Row justifyContent="space-between" part="field-nps-label">
        <Text.Caption part="field-nps-left-label" color="neutral.400">
          {fieldData.negativeLabel ?? `Not likely at all`}
        </Text.Caption>
        <Text.Caption part="field-nps-right-label" color="neutral.400">
          {fieldData.positiveLabel ?? `Extremely likely`}
        </Text.Caption>
      </Flex.Row>
    </Flex.Column>
  )
}
