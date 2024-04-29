import * as React from 'react'
import { Box, BoxProps } from '@/components/Box'

export const Row = React.forwardRef((props: BoxProps, ref) => (
  <Box display="flex" flexDirection="row" {...props} ref={ref} />
))

export const Column = React.forwardRef((props: BoxProps, ref) => (
  <Box display="flex" flexDirection="column" {...props} ref={ref} />
))
