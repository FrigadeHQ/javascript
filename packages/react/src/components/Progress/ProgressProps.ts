import type { BoxProps } from '@/components/Box'

export interface ProgressProps extends BoxProps {
  current: number
  total: number
}
