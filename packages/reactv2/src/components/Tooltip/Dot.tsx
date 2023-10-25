import { CSSProperties } from 'react'
import { Box } from '../Box'

import { animationPulse } from './Dot.css'

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
        className={animationPulse}
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
