import * as React from 'react'
import { Box, BoxProps } from '../Box'

const Row = React.forwardRef(({ children, css, ...props }: BoxProps, ref) => {
  return (
    <Box css={[{ display: 'flex', flexDirection: 'row' }, css]} {...props} ref={ref}>
      {children}
    </Box>
  )
})

const Column = React.forwardRef(({ children, css, ...props }: BoxProps, ref) => {
  return (
    <Box css={[{ display: 'flex', flexDirection: 'column' }, css]} {...props} ref={ref}>
      {children}
    </Box>
  )
})

export const Flex = {
  Column,
  Row,
}
