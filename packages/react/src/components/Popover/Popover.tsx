import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'

import { FloatingNode, useFloatingNodeId } from '@floating-ui/react'

import { Box, type BoxProps } from '@/components/Box'
import { Overlay } from '@/components/Overlay'
import { Spotlight } from '@/components/Spotlight'

import { type FloatingProps, type FloatingReturn, useFloating } from '@/hooks/useFloating'
import { useVisibility } from '@/hooks/useVisibility'

export interface PopoverContextValue {
  floating?: FloatingReturn
  floatingNodeId: string | null
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

const PopoverContext = createContext<PopoverContextValue>({
  floatingNodeId: null,
  isOpen: false,
  setIsOpen: () => {},
})

export interface PopoverRootProps extends FloatingProps {
  autoScroll?: ScrollIntoViewOptions | boolean
  children?: React.ReactNode
  defaultOpen?: boolean
  modal?: boolean
  spotlight?: boolean
}

export interface PopoverContentProps extends BoxProps {}

export interface PopoverTriggerProps extends BoxProps {}

export function Root({
  align = 'center',
  alignOffset = 0,
  anchor,
  autoScroll = false,
  children,
  defaultOpen = false,
  modal = false,
  onOpenChange = () => {},
  open,
  side = 'bottom',
  sideOffset = 0,
  spotlight = false,
  ...floatingProps
}: PopoverRootProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const [scrollComplete, setScrollComplete] = useState(false)

  // Defer to controlled open prop, otherwise manage open state internally
  const canonicalOpen = open ?? internalOpen

  const floatingNodeId = useFloatingNodeId()

  const floating = useFloating({
    align,
    alignOffset,
    anchor,
    nodeId: floatingNodeId,
    onOpenChange: (newOpen) => {
      onOpenChange(newOpen)

      if (open == null) {
        setInternalOpen(newOpen)
      }
    },
    open: canonicalOpen,
    side,
    sideOffset,
    ...floatingProps,
  })

  const { refs } = floating

  // TODO: Split this out to useAutoScroll hook
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

  // TODO: Generalize / dedupe Spotlight and Overlay throughout SDK
  return (
    <PopoverContext.Provider
      value={{
        floating,
        floatingNodeId,
        isOpen: canonicalOpen,
        setIsOpen: setInternalOpen,
      }}
    >
      {spotlight && canonicalOpen && <Spotlight anchor={anchor} />}
      {modal && !spotlight && canonicalOpen && <Overlay lockScroll />}

      {children}
    </PopoverContext.Provider>
  )
}

export function Content({ children, css, part, style, ...props }: BoxProps) {
  const { floating, floatingNodeId } = useContext(PopoverContext)

  const { isVisible: isAnchorVisible } = useVisibility(
    floating?.refs.reference.current as Element | null
  )

  if (floating == null) {
    return null
  }

  const { floatingStyles, getFloatingProps, placement, refs, status } = floating

  if (refs.reference.current == null || !isAnchorVisible) {
    return null
  }

  return (
    <FloatingNode id={floatingNodeId}>
      <Box
        autoFocus
        css={{
          '&[data-status="unmounted"]': {
            display: 'none',
          },
          ...css,
        }}
        data-placement={placement}
        data-status={status.status}
        part={['popover-content', part]}
        ref={refs.setFloating}
        style={{
          ...floatingStyles,
          ...style,
        }}
        {...getFloatingProps()}
        {...props}
      >
        <Box part="popover-transition-container">{children}</Box>
      </Box>
    </FloatingNode>
  )
}

export function Trigger({ children, part, ...props }: BoxProps) {
  const {
    floating: { getReferenceProps, refs },
    setIsOpen,
  } = useContext(PopoverContext)

  return (
    <Box
      ref={refs?.setReference}
      onClick={() => setIsOpen((prev) => !prev)}
      part={['popover-trigger', part]}
      {...props}
      {...(getReferenceProps?.() ?? {})}
    >
      {children}
    </Box>
  )
}
