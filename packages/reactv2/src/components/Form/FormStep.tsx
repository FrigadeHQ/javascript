import { useController, useForm, SubmitHandler } from 'react-hook-form'

import { Button } from '@/components/Button'
import { Flex } from '@/components/Flex/Flex'

import { type FormProps } from '.'

function FieldWrapper({ fieldComponent: FieldComponent, control, fieldData }) {
  // See: https://react-hook-form.com/get-started#Applyvalidation
  // NOTE: "validate" is intentionally omitted, as it's a function
  const ruleProps = new Set(['required', 'min', 'max', 'minLength', 'maxLength', 'pattern'])
  const rules = Object.fromEntries(Object.entries(fieldData).filter(([key]) => ruleProps.has(key)))

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

  step.fields?.forEach((fieldData) => {
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
