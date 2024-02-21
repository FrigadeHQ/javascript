import { keyframes } from '@emotion/react'
import * as Collapsible from '@radix-ui/react-collapsible'

import { Button } from '@/components/Button'
import { Box } from '@/components/Box'
import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'
import { Flow, type FlowPropsWithoutChildren } from '@/components/Flow'

export interface ChecklistProps extends FlowPropsWithoutChildren {}

const slideDown = keyframes`
  from {
    height: 0;
    opacity: 0;
  }
  to {
    height: var(--radix-collapsible-content-height);
    opacity: 1;
  }
`

const slideUp = keyframes`
  from {
    height: var(--radix-collapsible-content-height);
    opacity: 1;
  }
  to {
    height: 0;
    opacity: 0;
  }
`

function CollapsibleStep({ open = false, step }) {
  const { title, subtitle, primaryButtonTitle, secondaryButtonTitle } = step

  return (
    <Card borderWidth="md">
      <Collapsible.Root defaultOpen={open}>
        <Collapsible.Trigger asChild>
          <Button.Plain>{title}</Button.Plain>
        </Collapsible.Trigger>
        <Collapsible.Content asChild>
          <Flex.Column
            gap={5}
            css={{
              '&[data-state="open"]': {
                animation: `${slideDown} 300ms ease-out`,
              },
              '&[data-state="closed"]': {
                animation: `${slideUp} 300ms ease-out`,
              },
              overflow: 'hidden',
            }}
          >
            <Card.Media aspectRatio={2.5} objectFit="cover" src={step.imageUri} />
            <Card.Subtitle>{subtitle}</Card.Subtitle>
            <Flex.Row gap={3}>
              <Card.Secondary title={secondaryButtonTitle} />
              <Card.Primary title={primaryButtonTitle} />
            </Flex.Row>
          </Flex.Column>
        </Collapsible.Content>
      </Collapsible.Root>
    </Card>
  )
}

export function Checklist({ flowId, ...props }: ChecklistProps) {
  return (
    <Flow as={Card} borderWidth="md" flowId={flowId} part="checklist" {...props}>
      {({ flow, step }) => {
        const stepList = Array.from(flow.steps?.entries()).map(([, s]) => (
          <CollapsibleStep key={s.id} open={s.id === step.id} step={s} />
        ))

        return (
          <>
            <Card.Title>{flow.title}</Card.Title>
            <Card.Subtitle>{flow.subtitle}</Card.Subtitle>

            {stepList}
          </>
        )
      }}
    </Flow>
  )
}
