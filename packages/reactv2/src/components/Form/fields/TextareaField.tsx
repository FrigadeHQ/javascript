import { Text } from '@/components/Text'

import { type FormFieldProps } from '..'
import { BaseField } from './BaseField'

export function TextareaField(props: FormFieldProps) {
  return (
    <BaseField {...props}>
      {(fieldProps) => <Text.Body2 as="textarea" {...fieldProps}></Text.Body2>}
    </BaseField>
  )
}
