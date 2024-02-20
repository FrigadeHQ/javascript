import * as React from 'react'
import { Box, BoxProps } from '../Box'

export const Row = React.forwardRef(({ children, css, ...props }: BoxProps, ref) => {
  return (
    <Box css={[{ display: 'flex', flexDirection: 'row' }, css]} {...props} ref={ref}>
      {children}
    </Box>
  )
})

export const Column = React.forwardRef(({ children, css, ...props }: BoxProps, ref) => {
  return (
    <Box css={[{ display: 'flex', flexDirection: 'column' }, css]} {...props} ref={ref}>
      {children}
    </Box>
  )
})
