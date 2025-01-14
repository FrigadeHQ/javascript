import {
  autoUpdate,
  flip,
  offset,
  type Placement,
  shift,
  useClick,
  useDismiss,
  useFloating,
  type UseFloatingOptions,
  type UseFloatingReturn,
  useInteractions,
  type UseInteractionsReturn,
  useRole,
  useTransitionStatus,
} from '@floating-ui/react'
import { createContext, type Dispatch, type SetStateAction, useContext, useState } from 'react'

import { Box } from '@/components/Box'
import { Flow } from '@/components/Flow'

export interface FloatingChecklistContextValue {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

const FloatingChecklistContext = createContext<FloatingChecklistContextValue>({
  isOpen: false,
  setIsOpen: () => {},
})

export type AlignValue = 'after' | 'before' | 'center' | 'end' | 'start'

function getOriginalAlign(align: AlignValue) {
  switch (align) {
    case 'after':
      return 'end'
      break
    case 'before':
      return 'start'
      break
    default:
      return align
  }
}

export function Floating({
  align = 'center',
  alignOffset = 0,
  children,
  css,
  defaultOpen = false,
  flowId,
  onOpenChange = () => {},
  open,
  part,
  side = 'bottom',
  sideOffset = 0,
  style,
  ...props
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)

  const canonicalOpen = open ?? internalOpen

  const placement = `${side}-${getOriginalAlign(align)}` as Placement

  function offsetMiddleware({ rects }) {
    const offsets = {
      alignmentAxis: alignOffset,
      mainAxis: sideOffset,
    }

    // if align is before or after
    if (['after', 'before'].includes(align)) {
      // if side is bottom or top
      if (['bottom', 'top'].includes(side)) {
        // hOffset
        offsets.alignmentAxis = alignOffset - rects.floating.width
      } else {
        // vOffset
        offsets.alignmentAxis = alignOffset - rects.floating.height
      }
    }

    return offsets
  }

  const {
    context,
    floatingStyles,
    // placement: computedPlacement,
    refs,
  } = useFloating({
    middleware: [offset(offsetMiddleware, [align, alignOffset, side, sideOffset]), flip(), shift()],
    onOpenChange,
    open: canonicalOpen,
    placement,
    whileElementsMounted: autoUpdate,
  })

  const click = useClick(context)
  const dismiss = useDismiss(context, {
    outsidePress: false,
  })
  const role = useRole(context)
  const status = useTransitionStatus(context)

  // Merge all the interactions into prop getters
  const { getFloatingProps, getReferenceProps } = useInteractions([click, dismiss, role])

  return (
    <Flow flowId={flowId}>
      {({ flow }) => {
        return (
          <FloatingChecklistContext.Provider
            value={{
              isOpen: internalOpen,
              setIsOpen: setInternalOpen,
            }}
          >
            <FloatingTrigger triggerRef={refs.setReference} {...getReferenceProps()}>
              {children}
            </FloatingTrigger>
            <Box
              background="neutral.background"
              border="md solid neutral.border"
              borderRadius="md"
              padding="2"
              css={{
                opacity: 1,
                transitionProperty: 'opacity',
                '&[data-status="initial"],&[data-status="close"]': {
                  opacity: 0,
                },
                '&[data-status="open"],&[data-status="close"]': {
                  transition: 'transform 0.2s ease-out',
                },
                ...css,
              }}
              data-placement={placement}
              data-status={status.status}
              part={['TODO-name-this', part]}
              ref={refs.setFloating}
              style={{
                ...floatingStyles,
                ...style,
                display: status.isMounted ? 'block' : 'none',
              }}
              {...getFloatingProps()}
              {...props}
            >
              {Array.from(flow.steps.values()).map((step) => (
                <Box key={step.id} padding="1">
                  {step.title}
                </Box>
              ))}
            </Box>
          </FloatingChecklistContext.Provider>
        )
      }}
    </Flow>
  )
}

function FloatingTrigger({ children, triggerRef }) {
  const { setIsOpen } = useContext(FloatingChecklistContext)
  return (
    <Box display="inline-block" ref={triggerRef} onClick={() => setIsOpen((prev) => !prev)}>
      {children}
    </Box>
  )
}
