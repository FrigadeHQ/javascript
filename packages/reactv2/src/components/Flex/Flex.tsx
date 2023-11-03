import { Box, BoxProps } from '../Box'

export function Flex({ children, css, ...props }: BoxProps) {
  return (
    <Box css={[{ display: 'flex' }, css]} {...props}>
      {children}
    </Box>
  )
}

function Row({ children, css, ...props }: BoxProps) {
  return (
    <Box css={[{ display: 'flex', flexDirection: 'row' }, css]} {...props}>
      {children}
    </Box>
  )
}

function Column({ children, css, ...props }: BoxProps) {
  return (
    <Box css={[{ display: 'flex', flexDirection: 'column' }, css]} {...props}>
      {children}
    </Box>
  )
}

Flex.Column = Column
Flex.Row = Row
