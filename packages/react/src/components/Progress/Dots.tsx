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
        key={i}
        r={4}
        cx={4 + 16 * i}
        cy="4px"
        fill={current - 1 === i ? theme.colors.blue500 : theme.colors.blue800}
      />
    )
  })

  return (
    <Box
      as="svg"
      height="8px"
      part="progress-dots"
      viewBox={`0 0 ${16 * total - 8} 8`}
      width={16 * total - 8}
      {...props}
    >
      {dots}
    </Box>
  )
}
