import { Button } from '@/components/Button'
import { Flex } from '@/components/Flex'
import { FormFieldProps } from '@/components/Form'
import { Text } from '@/components/Text'

export function NPSField({
  field,
  fieldData,
  submit,
  options,
}: FormFieldProps & { options: { label: string; value: string }[] }) {
  const buttons = options.map((option) => {
    const Component = field.value === option.value ? Button.Primary : Button.Secondary
    return (
      <Component
        borderWidth="1px"
        key={option.value}
        onClick={() => {
          field.onChange(option.value)
          submit()
        }}
        title={option.label}
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
