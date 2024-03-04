import { Card } from '@/components/Card'
import { Form, type FormProps } from '@/components/Form'

import { NPSField } from './NPSField'

export function NPS({ as = Card, flowId, fieldTypes, ...props }: FormProps) {
  return (
    <Form
      as={as}
      flowId={flowId}
      fieldTypes={{
        nps: NPSField,
        ...fieldTypes,
      }}
      maxWidth="auto"
      minWidth="min-content"
      width="50vw"
      {...props}
    />
  )
}
