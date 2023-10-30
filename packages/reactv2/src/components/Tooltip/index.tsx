import React, { useEffect, useRef, useState } from 'react'

import { XMarkIcon } from '@heroicons/react/24/solid'
import * as Popover from '@radix-ui/react-popover'

import { useBoundingClientRect } from '../../hooks/useBoundingClientRect'
import { Box } from '../Box'
import { Button, ButtonProps } from '../Button'
import { Dot } from './Dot'
import { Text, TextProps } from '../Text'
import { getDotPosition } from './getDotPosition'
import { mapTooltipPropsToRadixProps } from './mapTooltipPropsToPopoverProps'

// TODO: Split out into intermediate Radix-like sub components

interface MergedRadixPopoverProps
  extends Pick<Popover.PopoverProps, 'defaultOpen' | 'modal' | 'onOpenChange' | 'open'>,
    Omit<Popover.PopoverContentProps, 'align' | 'asChild'> {}
export interface TooltipProps extends MergedRadixPopoverProps {
  align?: Popover.PopoverContentProps['align'] | 'before' | 'after'
  anchor?: string
  spotlight?: boolean
  style?: React.CSSProperties
}

export function Tooltip({ anchor, children, spotlight = false, style, ...props }: TooltipProps) {
  const { node: contentNode, rect: contentRect, ref: contentRef } = useBoundingClientRect()
  const [alignAttr, setAlignAttr] = useState(props.align)
  const [sideAttr, setSideAttr] = useState(props.side)

  // Radix will update data attrs to let us know if Popover.Content has collided
  if (contentNode !== null) {
    const currentAlignAttr = contentNode.getAttribute('data-align')
    const currentSideAttr = contentNode.getAttribute('data-side')

    if (alignAttr !== currentAlignAttr) {
      setAlignAttr(currentAlignAttr)
    }

    if (sideAttr !== currentSideAttr) {
      setSideAttr(currentSideAttr)
    }
  }

  const { contentProps, rootProps } = mapTooltipPropsToRadixProps(props, contentRect)

  const anchorRef = useRef(null)
  const [anchorElementRef, setAnchorElementRef] = useState(null)

  useEffect(() => {
    const anchorQuery = document.querySelector(anchor)

    if (anchorQuery != null) {
      anchorRef.current = anchorQuery
      setAnchorElementRef(anchorRef)
    }
  }, [anchor])

  if (anchorElementRef == null) return null

  const anchorRect = anchorElementRef.current.getBoundingClientRect()

  let anchorRadius = '0'
  if (typeof window !== 'undefined') {
    anchorRadius = window.getComputedStyle(anchorElementRef.current).borderRadius
  }

  const dotPosition = getDotPosition({ props, alignAttr, sideAttr })

  return (
    <Popover.Root defaultOpen={true} {...rootProps}>
      <Popover.Anchor virtualRef={anchorElementRef} style={{ borderRadius: '10px' }} />
      <Popover.Portal>
        <>
          {spotlight && (
            <Box
              style={{
                borderRadius: anchorRadius,
                boxShadow: '0 0 0 2000px rgb(0 0 0 / 0.5)',
                height: anchorRect.height,
                left: anchorRect.left,
                position: 'absolute',
                top: anchorRect.top,
                width: anchorRect.width,
              }}
            />
          )}
          <Popover.Content asChild {...contentProps} ref={contentRef}>
            <Box
              backgroundColor="white"
              borderRadius="md"
              padding={5}
              style={{
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                width: '300px',
                ...style,
              }}
            >
              <Dot style={dotPosition} />

              {children}
            </Box>
          </Popover.Content>
        </>
      </Popover.Portal>
    </Popover.Root>
  )
}

Tooltip.Close = ({ ...props }: Popover.PopoverCloseProps) => {
  return (
    <Popover.Close
      aria-label="Close"
      style={{
        background: 'transparent',
        border: 0,
        position: 'absolute',
        top: 8,
        right: 0,
      }}
      {...props}
    >
      <XMarkIcon height="20" fill="black" />
    </Popover.Close>
  )
}

// TODO: Flesh out Media component
Tooltip.Media = () => {
  return (
    <Box
      backgroundColor="gray900"
      borderRadius="md"
      mb={5}
      mt={-5}
      mx={-5}
      style={{
        aspectRatio: '2',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }}
    />
  )
}

Tooltip.Primary = ({ onClick, title, ...props }: ButtonProps) => {
  if (title == null) return null

  return <Button.Primary title={title} onClick={onClick} {...props} />
}

Tooltip.Progress = ({ children, ...props }: TextProps) => {
  if (children == null) return null

  return (
    <Text.Body2 fontWeight="demibold" {...props}>
      {children}
    </Text.Body2>
  )
}

Tooltip.Secondary = ({ onClick, title, ...props }: ButtonProps) => {
  if (title == null) return null

  return <Button.Secondary title={title} onClick={onClick} {...props} />
}

Tooltip.Subtitle = ({ children, ...props }: TextProps) => {
  if (children == null) return null

  return <Text.Body2 {...props}>{children}</Text.Body2>
}

Tooltip.Title = ({ children, ...props }: TextProps) => {
  if (children == null) return null

  return (
    <Text.Body1 fontWeight="bold" mb={1} {...props}>
      {children}
    </Text.Body1>
  )
}
