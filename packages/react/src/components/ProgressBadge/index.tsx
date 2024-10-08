import { Box } from '@/components/Box'
import { Card } from '@/components/Card'
import { ChevronDownMiniIcon } from '@/components/Icon/ChevronDownMiniIcon'
import { Flex } from '@/components/Flex'
import { Flow, type FlowPropsWithoutChildren } from '@/components/Flow'
import * as Progress from '@/components/Progress'

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
            aria-label="Progress Badge"
            borderWidth="md"
            cursor={isClickable ? 'pointer' : 'auto'}
            gap="1"
            p="3"
            part="progress-badge"
            role="complementary"
            {...containerProps}
          >
            <Flex.Row alignItems="center" gap="2" part="progress-badge-header">
              <Card.Title fontSize="sm" lineHeight="sm">
                {derivedTitle}
              </Card.Title>

              <Box
                as={ChevronDownMiniIcon}
                height="20px"
                marginLeft="auto"
                marginRight="-1"
                transform="rotate(-90deg)"
                width="20px"
              />
            </Flex.Row>

            <Flex.Row alignItems="center" gap="2" part="progress-badge-footer">
              <Progress.Fraction
                current={completedSteps}
                fontSize="xs"
                fontWeight="medium"
                lineHeight="xs"
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
