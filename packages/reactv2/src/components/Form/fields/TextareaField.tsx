import { Box } from '@/components/Box'

import { type FormFieldProps } from '..'
import { BaseField } from './BaseField'

export function TextareaField(props: FormFieldProps) {
  return (
    <BaseField {...props}>{(fieldProps) => <Box as="textarea" {...fieldProps}></Box>}</BaseField>
  )
}
