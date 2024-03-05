import { Form, type FormProps } from '@/components/Form'

import { NPSField } from './NPSField'
import { Modal } from '@/components/Modal'

export function NPS({ as = Modal, flowId, fieldTypes, ...props }: FormProps) {
  return (
    <Form
      as={as}
      flowId={flowId}
      fieldTypes={{
        nps: NPSField,
        ...fieldTypes,
      }}
      minWidth="620px"
      width="620px"
      align="bottom"
      {...props}
    />
  )
}
