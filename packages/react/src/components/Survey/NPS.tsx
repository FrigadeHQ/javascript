import { Dialog } from '@/components/Dialog'
import { Form, type FormProps } from '@/components/Form'

import { NPSField } from './NPSField'
import { useFlow } from '@/hooks/useFlow'

type NPSOptions = { label: string; value: string }[]

interface NPSProps extends FormProps {
  /**
   * The options to display in the NPS field.
   * If not provided, the default NPS numbers from 0 to 10 will be used.
   */
  options?: NPSOptions
}

export function NPS({ as = Dialog, flowId, fieldTypes, part, options, ...props }: NPSProps) {
  const { flow } = useFlow(flowId)

  const defaultOptions = [...Array(11)].map((_, i) => ({ label: `${i}`, value: `${i}` }))
  const npsOptions = options || defaultOptions

  return (
    <Form
      alignSelf="end"
      as={as}
      flowId={flowId}
      fieldTypes={{
        nps: (fieldProps) => <NPSField {...fieldProps} options={npsOptions} />,
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
      {...props}
      css={{
        ...{
          // Hides the submit button on the first page
          ...(!flow || flow.getCurrentStepIndex() == 0
            ? { '.fr-form-step-footer': { display: 'none' } }
            : {}),
          '.fr-form': {
            padding: '20px',
            '@media (min-width: 660px)': {
              minWidth: 'fit-content',
            },
            minWidth: '100%',
          },
          '.fr-form-step': {
            gap: '14px',
            '@media (min-width: 660px)': {
              gap: '1',
            },
          },
          ...((props.css as object) ?? {}),
        },
      }}
    />
  )
}
