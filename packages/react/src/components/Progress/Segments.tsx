import { Box } from '@/components/Box'
import { Flex } from '@/components/Flex'

import type { ProgressProps } from './ProgressProps'

export function Segments({ current, total, ...props }: ProgressProps) {
  const segments = [...Array(total)].map((_, i) => (
    <Box
      backgroundColor={current - 1 === i ? 'primary.surface' : 'blue800'}
      borderRadius="md"
      flexGrow={1}
      height="100%"
      key={i}
      minWidth="10px"
      part="progress-segment"
    />
  ))

  return (
    <Flex.Row gap={1} height="10px" part="progress-segments" {...props}>
      {segments}
    </Flex.Row>
  )
}
