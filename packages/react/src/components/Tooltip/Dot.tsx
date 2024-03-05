import { keyframes } from '@emotion/react'

import { Box, type BoxProps } from '@/components/Box'

const pulse = keyframes({
  '0%': {
    opacity: 0.5,
    transform: 'scale(0.5)',
  },
  '50%': {
    opacity: 0,
    transform: 'scale(1)',
  },
  '100%': {
    opacity: 0,
    transform: 'scale(1)',
  },
})

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
        part="dot-pulse"
        css={{
          animation: `2s ease-out infinite ${pulse}`,
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
