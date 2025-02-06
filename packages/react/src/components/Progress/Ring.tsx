import { Box } from '@/components/Box'
import { Text } from '@/components/Text'

import { theme } from '@/shared/theme'

import type { ProgressProps } from './ProgressProps'

export function Ring({
  css,
  current,
  height = '48px',
  showLabel = false,
  strokeWidth = '8px',
  total,
  width = '48px',
  ...props
}: ProgressProps) {
  if (total == 1) {
    return null
  }

  const progressPercent = total > 0 ? Math.min(Math.round((current / total) * 100) / 100, 1) : 0

  // TODO: Configurable size
  return (
    <Box
      aria-description="Progress represented as a ring"
      aria-label="Progress Ring"
      aria-valuemin="0"
      aria-valuemax={total}
      aria-valuenow={current}
      as="svg"
      css={{
        '--progress-percent': progressPercent,
        '--radius': `calc((min(${height}, ${width}) - ${strokeWidth}) / 2)`,
        '--circumference': `calc(var(--radius) * pi * 2)`,
        '--dash-length': 'calc(var(--circumference) * var(--progress-percent))',
        '--gap-length': 'calc(var(--circumference) - var(--dash-length))',
        ...css,
      }}
      height={height}
      part="progress-ring"
      position="relative"
      role="meter"
      width={width}
      {...props}
    >
      <Box
        as="circle"
        cx="50%"
        cy="50%"
        fill="transparent"
        part="progress-ring-track"
        r="var(--radius)"
        stroke={theme.colors.primary['800']}
        strokeWidth={strokeWidth}
      />
      <Box
        as="circle"
        cx="50%"
        cy="50%"
        fill="transparent"
        part="progress-ring-filled"
        r="var(--radius)"
        stroke={theme.colors.primary.surface}
        strokeWidth={strokeWidth}
        style={{
          strokeDasharray: `var(--dash-length) var(--gap-length)`,
        }}
        transform="rotate(-90deg)"
        transformOrigin="50% 50%"
        transition="stroke-dasharray 0.2s ease-out"
      />
      {showLabel && (
        <Text.Caption
          as="text"
          dominantBaseline="middle"
          fontWeight="medium"
          textAnchor="middle"
          _x="50%"
          _y="52%"
        >
          {progressPercent * 100}
        </Text.Caption>
      )}
    </Box>
  )
}
