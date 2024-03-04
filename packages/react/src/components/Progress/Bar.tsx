import { Box } from '@/components/Box'

import type { ProgressProps } from './ProgressProps'

export function Bar({ current, total, ...props }: ProgressProps) {
  const progressPercent = total > 0 ? Math.min(current / total, 1) : 0

  const barWidth = progressPercent === 0 ? '10px' : `${100 * progressPercent}%`

  return (
    <Box part="progress-bar" backgroundColor="blue800" borderRadius="md" height="10px" {...props}>
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
