import { Box } from '@/components/Box'

import { theme } from '@/shared/theme'

import type { ProgressProps } from './ProgressProps'

export function Dots({ current, total, ...props }: ProgressProps) {
  if (total == 1) {
    return null
  }

  const dots = [...Array(total)].map((_, i) => {
    return (
      <Box
        as="circle"
        cx={4 + 16 * i}
        cy="4px"
        fill={current - 1 === i ? theme.colors.blue500 : theme.colors.blue800}
        key={i}
        part={['progress-dot', current - 1 === i ? 'progress-dot-filled' : null]}
        r={4}
      />
    )
  })

  return (
    <Box
      aria-description="Progress represented as dots"
      aria-label="Progress Dots"
      aria-valuemin="0"
      aria-valuemax={total}
      aria-valuenow={current}
      as="svg"
      height="8px"
      part="progress-dots"
      role="meter"
      viewBox={`0 0 ${16 * total - 8} 8`}
      width={16 * total - 8}
      {...props}
    >
      {dots}
    </Box>
  )
}
