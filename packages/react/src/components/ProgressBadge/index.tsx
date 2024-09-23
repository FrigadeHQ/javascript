import { Box } from '@/components/Box'
import { Card } from '@/components/Card'
import { ChevronDownMiniIcon } from '@/components/Icon/ChevronDownMiniIcon'
import { Flex } from '@/components/Flex'
import { Flow, type FlowPropsWithoutChildren } from '@/components/Flow'
import * as Progress from '@/components/Progress'
import { Text } from '@/components/Text'

import { deepmerge } from '@/shared/deepmerge'

export interface ProgressBadgeProps extends FlowPropsWithoutChildren {
  /**
   * Override the title displayed on the ProgressBadge. Defaults to the title of the associated Flow, or the title of that Flow's first Step.
   */
  title?: string
}

function firstNonEmptyString(...strings: string[]) {
  for (const str of strings) {
    if (str != null && str.length > 0) {
      return str
    }
  }

  return null
}

export function ProgressBadge({ title, ...props }: ProgressBadgeProps) {
  return (
    <Flow as={null} {...props}>
      {({ flow, parentProps: { containerProps }, step }) => {
        const derivedTitle = firstNonEmptyString(title, flow.title, step.title)

        const completedSteps = flow?.getNumberOfCompletedSteps() ?? 0
        const availableSteps = flow?.getNumberOfAvailableSteps() ?? 1

        const isClickable = containerProps.onClick != null

        if (isClickable) {
          containerProps.css = deepmerge(
            {
              '&:hover': {
                backgroundColor: 'var(--fr-colors-neutral-hover-background)',
              },
            },
            containerProps.css ?? {}
          )
        }

        return (
          <Card
            borderWidth="md"
            cursor={isClickable ? 'pointer' : 'auto'}
            gap=""
            p="3 2"
            part="progress-badge"
            {...containerProps}
          >
            <Flex.Row alignItems="center" gap="2" part="progress-badge-header">
              <Card.Title as={Text.Caption}>{derivedTitle}</Card.Title>

              <Box
                as={ChevronDownMiniIcon}
                height="20px"
                marginLeft="auto"
                transform="rotate(-90deg)"
                width="20px"
              />
            </Flex.Row>

            <Flex.Row alignItems="center" gap="2" part="progress-badge-footer">
              <Progress.Fraction
                current={completedSteps}
                fontWeight="medium"
                total={availableSteps}
              />

              <Progress.Segments current={completedSteps} flexGrow="1" total={availableSteps} />
            </Flex.Row>
          </Card>
        )
      }}
    </Flow>
  )
}
