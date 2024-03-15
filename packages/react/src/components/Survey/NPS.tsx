import { Dialog } from '@/components/Dialog'
import { Form, type FormProps } from '@/components/Form'

import { NPSField } from './NPSField'
import { useFlow } from '@/hooks/useFlow'

export function NPS({ as = Dialog, flowId, fieldTypes, ...props }: FormProps) {
  const { flow } = useFlow(flowId)

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
      css={
        {
          ...(!flow || flow.getCurrentStepIndex() == 0
            ? { '.fr-form-step-footer': { display: 'none' } }
            : {}),
          '.fr-form': {
            padding: '20px',
          },
          '.fr-form-step': {
            gap: '1',
          },
        }
        // Hides the submit button on the first page
      }
      {...props}
    />
  )
}
