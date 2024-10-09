import * as React from 'react'
import { Box, BoxProps } from '@/components/Box'

export const Row = React.forwardRef(function RowWithRef(props: BoxProps, ref) {
  return <Box display="flex" flexDirection="row" {...props} ref={ref} />
})
Row.displayName = 'Flex.Row'

export const Column = React.forwardRef(function ColumnWithRef(props: BoxProps, ref) {
  return <Box display="flex" flexDirection="column" {...props} ref={ref} />
})
Column.displayName = 'Flex.Column'
