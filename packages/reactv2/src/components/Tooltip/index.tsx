import React, { useEffect, useRef, useState } from 'react'

import { XMarkIcon } from '@heroicons/react/24/solid'
import * as Popover from '@radix-ui/react-popover'

import { useBoundingClientRect } from '../../hooks/useBoundingClientRect'
import { Box } from '../Box'
import { Button, ButtonProps } from '../Button'
import { Dot } from './Dot'
import { Media } from '../Media'
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
      <Popover.Anchor virtualRef={anchorElementRef} css={{ borderRadius: '10px' }} />
      <Popover.Portal>
        <>
          {spotlight && (
            <Box
              css={{
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
              css={({ colors, radii, space }) => ({
                background: colors.white,
                borderRadius: radii.md,
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                padding: space[5],
                position: 'relative',
                width: '300px',
                ...style,
              })}
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

Tooltip.Close = (props: ButtonProps) => {
  return (
    <Popover.Close aria-label="Close" asChild>
      <Button.Plain
        css={{
          position: 'absolute',
          top: 0,
          right: 0,
        }}
        {...props}
      >
        <XMarkIcon height="20" fill="currentColor" />
      </Button.Plain>
    </Popover.Close>
  )
}

// TODO: Flesh out Media component
Tooltip.Media = ({ src, type }) => {
  if (src == null) return null

  return (
    <Media
      src={src}
      css={({ radii, space }) => ({
        aspectRatio: '2',
        border: 0,
        borderRadius: `${radii.md} ${radii.md} 0 0`,
        margin: `${space[-5]} ${space[-5]} ${space[5]}`,
      })}
      type={type}
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
