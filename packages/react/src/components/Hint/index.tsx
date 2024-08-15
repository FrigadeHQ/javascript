import { useState } from 'react'

import { Box } from '@/components/Box'
import { Ping } from '@/components/Ping'

import { getPingPosition } from '@/components/Hint/getPingPosition'
import { useFloatingHint } from '@/components/Hint/useFloatingHint'

export type AlignValue = 'after' | 'before' | 'center' | 'end' | 'start'
export type SideValue = 'bottom' | 'left' | 'right' | 'top'

export interface HintProps {
  align?: AlignValue
  alignOffset?: number
  anchor: string
  children?: React.ReactNode
  defaultOpen?: boolean
  side?: SideValue
  sideOffset?: number
}

export function Hint({
  align = 'center',
  alignOffset = 0,
  anchor,
  children,
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
        {contentOpen && children}
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
