import { keyframes } from '@emotion/react'
import { useState } from 'react'

import { Box } from '@/components/Box'
import { Card } from '@/components/Card'
import { Ping } from '@/components/Ping'

import { getPingPosition } from '@/components/Hint/getPingPosition'
import { useFloatingHint } from '@/components/Hint/useFloatingHint'

export type AlignValue = 'after' | 'before' | 'center' | 'end' | 'start'
export type SideValue = 'bottom' | 'left' | 'right' | 'top'

export interface HintProps {
  align?: AlignValue
  alignOffset?: number
  anchor: string
  defaultOpen?: boolean
  side?: SideValue
  sideOffset?: number
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  25% {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

export function Hint({
  align = 'center',
  alignOffset = 0,
  anchor,
  defaultOpen = true,
  side = 'bottom',
  sideOffset = 0,
}: HintProps) {
  const [contentOpen, setContentOpen] = useState(defaultOpen)

  const { getFloatingProps, floatingStyles, refs } = useFloatingHint({
    align,
    alignOffset,
    anchor,
    // TODO: onOpenChange: setOpen,
    open: true,
    side,
    sideOffset,
  })

  return (
    <>
      <Box ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
        {contentOpen && (
          <Card animation={`${fadeIn} 300ms ease-out`} boxShadow="md">
            Hello
          </Card>
        )}
        <Ping
          onClick={() => {
            console.log('PING CLICK')
            setContentOpen((prev) => !prev)
          }}
          position="absolute"
          style={getPingPosition(align, side)}
        />
      </Box>
    </>
  )
}
