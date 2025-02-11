import { useRef, useState } from 'react'

import { Box, type BoxProps } from '@/components/Box'
import { Overlay } from '@/components/Overlay'
import { Ping } from '@/components/Ping'
import { Spotlight } from '@/components/Spotlight'

import { getPingPosition } from '@/components/Hint/getPingPosition'
import { useAutoScroll } from '@/hooks/useAutoScroll'
import { useFloating } from '@/hooks/useFloating'
import { useVisibility } from '@/hooks/useVisibility'

export type AlignValue = 'after' | 'before' | 'center' | 'end' | 'start'
export type SideValue = 'bottom' | 'left' | 'right' | 'top'
export type ExtendedPlacement = `${SideValue}-${AlignValue}`

export interface HintProps extends BoxProps {
  align?: AlignValue
  alignOffset?: number
  anchor: string
  autoScroll?: ScrollIntoViewOptions | boolean
  children?: React.ReactNode
  defaultOpen?: boolean
  lockScroll?: boolean
  modal?: boolean
  onMount?: () => void
  onOpenChange?: (open: boolean) => void
  open?: boolean
  side?: SideValue
  sideOffset?: number
  spotlight?: boolean
}

export function Hint({
  align = 'center',
  alignOffset = 0,
  anchor,
  autoScroll = false,
  children,
  css = {},
  defaultOpen = true,
  lockScroll = true,
  modal = false,
  onMount,
  onOpenChange = () => {},
  open,
  part,
  side = 'bottom',
  sideOffset = 0,
  spotlight = false,
  style = {},
  ...props
}: HintProps) {
  const [internalOpen, setInteralOpen] = useState(defaultOpen)

  // Defer to controlled open prop, otherwise manage open state internally
  const canonicalOpen = open ?? internalOpen

  const { getFloatingProps, getReferenceProps, floatingStyles, placement, refs, status } =
    useFloating({
      align,
      alignOffset,
      anchor,
      onOpenChange: (newOpen) => {
        onOpenChange(newOpen)

        if (open == null) {
          setInteralOpen(newOpen)
        }
      },
      open: canonicalOpen,
      side,
      sideOffset,
    })

  const [finalSide, finalAlign] = placement.split('-')
  const referenceProps = getReferenceProps()

  const { isVisible } = useVisibility(refs.reference.current as Element | null)
  const isMounted = useRef(false)

  useAutoScroll(refs.reference.current as Element, autoScroll)

  const shouldMount = refs.reference.current !== null && isVisible

  if (!shouldMount) {
    isMounted.current = false
    return null
  } else if (isMounted.current === false) {
    isMounted.current = true
    onMount?.()
  }

  return (
    <>
      {spotlight && canonicalOpen && <Spotlight anchor={anchor} lockScroll={lockScroll} />}
      {modal && !spotlight && canonicalOpen && <Overlay lockScroll={lockScroll} />}

      <Box
        css={{
          '&[data-status="open"]': {
            transition: 'transform 0.2s ease-out',
          },
          ...css,
        }}
        data-placement={placement}
        data-status={status.status}
        part={['hint', part]}
        ref={refs.setFloating}
        style={{
          ...floatingStyles,
          ...style,
        }}
        {...getFloatingProps()}
        {...props}
      >
        {canonicalOpen && children}

        <Ping
          {...referenceProps}
          position="absolute"
          style={getPingPosition({ align: finalAlign, side: finalSide })}
          clickable={defaultOpen === false}
        />
      </Box>
    </>
  )
}
