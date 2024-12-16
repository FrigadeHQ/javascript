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

  /**
   * The label to display for the positive end of the NPS scale.
   * If not provided, the default label "Extremely likely" will be used.
   */
  positiveLabel?: string

  /**
   * The label to display for the negative end of the NPS scale.
   * If not provided, the default label "Not likely at all" will be used.
   */
  negativeLabel?: string
}

export function NPS({
  as = Dialog,
  flowId,
  fieldTypes,
  part,
  options,
  positiveLabel,
  negativeLabel,
  ...props
}: NPSProps) {
  const { flow } = useFlow(flowId)

  const defaultOptions =
    (flow?.props?.options as NPSOptions) ??
    [...Array(11)].map((_, i) => ({ label: `${i}`, value: `${i}` }))
  const npsOptions = options || defaultOptions

  return (
    <Form
      alignSelf="end"
      as={as}
      flowId={flowId}
      fieldTypes={{
        nps: (fieldProps) => (
          <NPSField
            {...fieldProps}
            options={npsOptions}
            positiveLabel={
              (flow?.props?.positiveLabel as string) ?? positiveLabel ?? 'Extremely likely'
            }
            negativeLabel={
              (flow?.props?.negativeLabel as string) ?? negativeLabel ?? 'Not likely at all'
            }
          />
        ),
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
            : {
                '.fr-card-header': {
                  // Heuristic to prevent width jumpiness between first and second step
                  minWidth: npsOptions.length * 51,
                },
              }),
          '.fr-form': {
            padding: '20px',
            '@media (max-width: 660px)': {
              minWidth: '100%',
            },
          },
          '.fr-nps-field': {
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
          '.fr-nps': {
            maxWidth: 'min-content',
          },
          ...((props.css as object) ?? {}),
        },
      }}
    />
  )
}
