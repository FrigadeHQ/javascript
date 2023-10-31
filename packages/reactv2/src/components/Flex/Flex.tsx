import { Box, BoxProps } from '../Box'

export function Flex({ children, ...props }: BoxProps) {
  return (
    <Box display="flex" {...props}>
      {children}
    </Box>
  )
}

function Row({ children, ...props }: BoxProps) {
  return (
    <Box display="flex" flexDirection="row" {...props}>
      {children}
    </Box>
  )
}

function Column({ children, ...props }: BoxProps) {
  return (
    <Box display="flex" flexDirection="column" {...props}>
      {children}
    </Box>
  )
}

Flex.Column = Column
Flex.Row = Row
