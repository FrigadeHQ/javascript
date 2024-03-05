import { Dialog } from '@/components/Dialog'
import { Form, type FormProps } from '@/components/Form'

import { NPSField } from './NPSField'

export function NPS({ as = Dialog, flowId, fieldTypes, ...props }: FormProps) {
  return (
    <Form
      alignSelf="end"
      as={as}
      flowId={flowId}
      fieldTypes={{
        nps: NPSField,
        ...fieldTypes,
      }}
      minWidth="620px"
      modal={false}
      width="620px"
      {...props}
    />
  )
}
