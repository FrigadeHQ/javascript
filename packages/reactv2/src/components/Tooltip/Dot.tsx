import { CSSProperties } from 'react'
import { Box, BoxProps } from '../Box'

import { animationPulse } from './Dot.css'

export interface DotProps extends BoxProps {}

export function Dot({ style = {}, part = '', ...props }: DotProps) {
  return (
    <Box
      part={`dot-wrapper ${part}`}
      style={{
        height: '48px',
        position: 'absolute',
        width: '48px',
        ...style,
      }}
      {...props}
    >
      <Box
        backgroundColor="primary.surface"
        className={animationPulse}
        part="dot-pulse"
        style={{
          borderRadius: '24px',
          height: '48px',
          left: 0,
          position: 'absolute',
          top: 0,
          transformOrigin: 'center center',
          width: '48px',
        }}
      />
      <Box
        backgroundColor="primary.surface"
        part="dot"
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
