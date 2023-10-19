import { CSSProperties } from 'react'
import { Box } from '../Box'

interface DotProps {
  style?: CSSProperties
}

export function Dot({ style = {} }: DotProps) {
  return (
    <Box
      style={{
        height: '48px',
        position: 'absolute',
        width: '48px',
        ...style,
      }}
    >
      <Box
        backgroundColor="primary.surface"
        style={{
          borderRadius: '24px',
          height: '48px',
          left: 0,
          opacity: 0.15,
          position: 'absolute',
          top: 0,
          width: '48px',
        }}
      />
      <Box
        backgroundColor="primary.surface"
        style={{
          borderRadius: '12px',
          height: '24px',
          left: '12px',
          position: 'absolute',
          top: '12px',
          width: '24px',
        }}
      />
    </Box>
  )
}
