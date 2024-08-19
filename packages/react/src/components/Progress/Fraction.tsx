import { Text } from '@/components/Text'

import type { ProgressProps } from './ProgressProps'

export function Fraction({ current, total, ...props }: ProgressProps) {
  return (
    <Text.Body2 part="progress-fraction" {...props}>
      {`${current}/${total}`}
    </Text.Body2>
  )
}
