import { Box } from '@/components/Box'

import { type FormFieldProps } from '..'
import { BaseField } from './BaseField'

export function TextField(props: FormFieldProps) {
  return (
    <BaseField {...props}>
      {(fieldProps) => <Box as="input" type="text" {...fieldProps} />}
    </BaseField>
  )
}
