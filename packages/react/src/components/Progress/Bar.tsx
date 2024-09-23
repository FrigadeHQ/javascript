import { Box } from '@/components/Box'

import type { ProgressProps } from './ProgressProps'

export function Bar({ current, total, ...props }: ProgressProps) {
  const progressPercent = total > 0 ? Math.min(current / total, 1) : 0

  const barWidth = progressPercent === 0 ? '10px' : `${100 * progressPercent}%`

  return (
    <Box
      aria-description="Progress represented as a bar"
      aria-label="Progress Bar"
      aria-valuemin="0"
      aria-valuemax={total}
      aria-valuenow={current}
      backgroundColor="neutral.800"
      borderRadius="md"
      height="10px"
      part="progress-bar"
      role="meter"
      {...props}
    >
      <Box
        backgroundColor="primary.surface"
        part="progress-bar-fill"
        borderRadius="md"
        height="100%"
        style={{
          width: barWidth,
        }}
        transition="width 300ms ease-out"
      />
    </Box>
  )
}
