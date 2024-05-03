import { Dialog } from '@/components/Dialog'
import { Form, type FormProps } from '@/components/Form'

import { NPSField } from './NPSField'
import { useFlow } from '@/hooks/useFlow'

export function NPS({ as = Dialog, flowId, fieldTypes, part, ...props }: FormProps) {
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
      modal={false}
      onEscapeKeyDown={(e: KeyboardEvent) => {
        if (typeof props.onEscapeKeyDown === 'function') {
          props.onEscapeKeyDown(e)
        }

        if (!e.defaultPrevented) {
          flow.skip()
        }
      }}
      part={['nps', part]}
      css={{
        // Hides the submit button on the first page
        ...(!flow || flow.getCurrentStepIndex() == 0
          ? { '.fr-form-step-footer': { display: 'none' } }
          : {}),
        '.fr-form': {
          padding: '20px',
          '@media (min-width: 660px)': {
            minWidth: '600px',
          },
          minWidth: '100%',
        },
        '.fr-form-step': {
          gap: '14px',
          '@media (min-width: 660px)': {
            gap: '1',
          },
        },
      }}
      {...props}
    />
  )
}
