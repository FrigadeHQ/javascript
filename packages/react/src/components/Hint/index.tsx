import { useEffect, useRef, useState } from 'react'

import { Box, type BoxProps } from '@/components/Box'
import { Overlay } from '@/components/Overlay'
import { Ping } from '@/components/Ping'
import { Spotlight } from '@/components/Spotlight'

import { getPingPosition } from '@/components/Hint/getPingPosition'
import { useFloatingHint } from '@/components/Hint/useFloatingHint'
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
  const [scrollComplete, setScrollComplete] = useState(false)

  // Defer to controlled open prop, otherwise manage open state internally
  const canonicalOpen = open ?? internalOpen

  const { getFloatingProps, getReferenceProps, floatingStyles, placement, refs, status } =
    useFloatingHint({
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

  useEffect(() => {
    if (!scrollComplete && autoScroll && refs.reference.current instanceof Element) {
      const scrollOptions: ScrollIntoViewOptions =
        typeof autoScroll !== 'boolean' ? autoScroll : { behavior: 'smooth', block: 'center' }

      /*
       * NOTE: "scrollend" event isn't supported widely enough yet :(
       *
       * We'll listen to a capture-phase "scroll" instead, and when it stops
       * bouncing, we can infer that the scroll we initiated is over.
       */
      let scrollTimeout: ReturnType<typeof setTimeout>
      window.addEventListener(
        'scroll',
        function scrollHandler() {
          clearTimeout(scrollTimeout)

          scrollTimeout = setTimeout(() => {
            window.removeEventListener('scroll', scrollHandler)
            setScrollComplete(true)
          }, 100)
        },
        true
      )

      refs.reference.current.scrollIntoView(scrollOptions)
    } else if (!autoScroll) {
      setScrollComplete(true)
    }
  }, [autoScroll, refs.reference, scrollComplete])

  const shouldMount = refs.reference.current !== null && scrollComplete && isVisible

  if (!shouldMount) {
    isMounted.current = false
    return null
  } else if (isMounted.current === false) {
    isMounted.current = true
    onMount?.()
  }

  return (
    <>
      {spotlight && canonicalOpen && <Spotlight anchor={anchor} />}
      {modal && !spotlight && canonicalOpen && <Overlay lockScroll />}

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
