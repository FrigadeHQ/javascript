import { Text } from '@/components/Text'

import { type FormFieldProps } from '..'
import { BaseField } from './BaseField'

export function TextField(props: FormFieldProps) {
  return (
    <BaseField {...props}>
      {(fieldProps) => <Text.Body2 as="input" type="text" {...fieldProps} />}
    </BaseField>
  )
}
