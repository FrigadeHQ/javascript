import { keyframes } from '@emotion/react'
import { useEffect, useState } from 'react'

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

export interface PingProps extends BoxProps {
  clickable?: boolean
}

export function Ping({ clickable = false, part = '', style = {}, ...props }: PingProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <Box
      borderRadius="24px"
      height="24px"
      part={`ping-wrapper ${part}`}
      position="relative"
      width="24px"
      cursor={clickable ? 'pointer' : undefined}
      style={{
        opacity: hasMounted ? 1 : 0,
        ...style,
      }}
      transition={'opacity 0.2s ease-out'}
      {...props}
    >
      <Box
        backgroundColor="primary.surface"
        animation={`2s ease-out infinite ${pulse}`}
        borderRadius="24px"
        height="48px"
        left="-12px"
        part="ping-pulse"
        pointerEvents="none"
        position="absolute"
        top="-12px"
        transformOrigin="center center"
        width="48px"
      />
      <Box
        backgroundColor="primary.surface"
        borderRadius="12px"
        height="24px"
        left="0"
        part="ping"
        position="absolute"
        top="0"
        width="24px"
        backgroundColor:hover={clickable ? 'primary.hover.surface' : undefined}
      />
    </Box>
  )
}
