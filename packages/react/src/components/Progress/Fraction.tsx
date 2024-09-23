import { Text } from '@/components/Text'

import type { ProgressProps } from './ProgressProps'

export function Fraction({ current, total, ...props }: ProgressProps) {
  return (
    <Text.Body2
      aria-description="Progress represented as a fraction of a total"
      aria-label="Progress Fraction"
      aria-valuemin="0"
      aria-valuemax={total}
      aria-valuenow={current}
      part="progress-fraction"
      role="meter"
      {...props}
    >
      {`${current}/${total}`}
    </Text.Body2>
  )
}
