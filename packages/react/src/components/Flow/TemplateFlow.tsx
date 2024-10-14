import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'
import { Flow } from '@/components/Flow'

import { flatDeserialize } from '@/components/Editor/serializer'

export function TemplateFlow(props) {
  const components = {
    'Button.Primary': Button.Primary,
    'Button.Secondary': Button.Secondary,
    Card: Card,
    'Card.Title': Card.Title,
    'Card.Subtitle': Card.Subtitle,
    'Flex.Row': Flex.Row,
  }

  return (
    <Flow {...props}>
      {({
        flow,
        handleDismiss,
        handlePrimary,
        handleSecondary,
        parentProps: { dismissible, flowId, variables, containerProps },
        step,
      }) => {
        const hydrated = flatDeserialize(flow.rawData.data.template, components)

        return hydrated
      }}
    </Flow>
  )
}
