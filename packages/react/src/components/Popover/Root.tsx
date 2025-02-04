import { createContext, type Dispatch, type SetStateAction, useState } from 'react'
import { useFloatingNodeId } from '@floating-ui/react'

import { Spotlight } from '@/components/Spotlight'
import { Overlay } from '@/components/Overlay'

import { useAutoScroll } from '@/hooks/useAutoScroll'
import { type FloatingProps, type FloatingReturn, useFloating } from '@/hooks/useFloating'

export interface PopoverContextValue {
  floating?: FloatingReturn
  floatingNodeId: string | null
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const PopoverContext = createContext<PopoverContextValue>({
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

  useAutoScroll(refs.reference.current as Element, autoScroll)

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
