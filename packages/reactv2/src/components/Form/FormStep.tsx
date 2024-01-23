import {
  useController,
  useForm,
  SubmitHandler,
  type ValidationRule,
  type Message,
} from 'react-hook-form'

import { Button } from '@/components/Button'
import { Flex } from '@/components/Flex/Flex'

import { type FormProps } from '.'

type Rules = Partial<{
  required: Message | ValidationRule<boolean>
  min: ValidationRule<number | string>
  max: ValidationRule<number | string>
  maxLength: ValidationRule<number>
  minLength: ValidationRule<number>
  pattern: ValidationRule<RegExp>
}>

// See: https://react-hook-form.com/get-started#Applyvalidation
// NOTE: "validate" is intentionally omitted
const ruleProps = new Set(['required', 'min', 'max', 'minLength', 'maxLength', 'pattern'])

function FieldWrapper({ fieldComponent: FieldComponent, control, fieldData }) {
  // pattern validator comes as a string from YAML, convert it to RegExp
  if (fieldData.pattern != null) {
    if (typeof fieldData.pattern === 'string') {
      fieldData.pattern = new RegExp(fieldData.pattern.replace(/^\/|\/$/g, ''))
    } else if (
      typeof fieldData.pattern === 'object' &&
      typeof fieldData.pattern.value === 'string'
    ) {
      fieldData.pattern.value = new RegExp(fieldData.pattern.value.replace(/^\/|\/$/g, ''))
    }
  }

  const rules = Object.fromEntries(
    Object.entries(fieldData).filter(([key]) => ruleProps.has(key))
  ) as Rules

  const controller = useController({
    name: fieldData.id,
    control,
    rules,
  })

  return <FieldComponent {...controller} fieldData={fieldData} />
}

export function FormStep({ fieldTypes, step }: Omit<FormProps, 'flowId'>) {
  const { control, handleSubmit } = useForm()
  const fields = []

  // TODO: Type for data
  function onSubmit(data) {
    //TODO: step.complete(data)
    console.log('FORM SUBMIT: ', data)
  }

  step.fields?.forEach((fieldData: Record<string, any>) => {
    if (fieldTypes[fieldData.type] != null) {
      fields.push(
        <FieldWrapper
          key={fieldData.id}
          control={control}
          fieldComponent={fieldTypes[fieldData.type]}
          fieldData={fieldData}
        />
      )
    }
  })

  return (
    <>
      {fields}
      <Flex.Row key="form-footer" justifyContent="flex-end">
        <Button.Primary
          title={step.primaryButtonTitle ?? 'Submit'}
          onClick={handleSubmit(onSubmit)}
        />
      </Flex.Row>
    </>
  )
}
