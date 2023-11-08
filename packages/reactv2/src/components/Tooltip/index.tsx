import React, { useEffect, useRef, useState } from 'react'
import { clsx } from 'clsx'

import { XMarkIcon } from '@heroicons/react/24/solid'
import * as Popover from '@radix-ui/react-popover'

import { useBoundingClientRect } from '../../hooks/useBoundingClientRect'
import { Box } from '../Box'
import { Button, ButtonProps } from '../Button'
import { Dot } from './Dot'
import { Flex } from '../Flex/Flex'
import { Media, MediaProps } from '../Media'
import { Text, TextProps } from '../Text'
import { getDotPosition } from './getDotPosition'
import { mapTooltipPropsToRadixProps } from './mapTooltipPropsToPopoverProps'

interface MergedRadixPopoverProps
  extends Pick<Popover.PopoverProps, 'defaultOpen' | 'modal' | 'onOpenChange' | 'open'>,
    Omit<Popover.PopoverContentProps, 'align' | 'asChild'> {}
export interface TooltipProps extends MergedRadixPopoverProps {
  align?: Popover.PopoverContentProps['align'] | 'before' | 'after'
  anchor?: string
  spotlight?: boolean
  style?: React.CSSProperties
}

export function Tooltip({
  anchor,
  children,
  css,
  spotlight = false,
  style,
  ...props
}: TooltipProps) {
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
      <Popover.Anchor virtualRef={anchorElementRef} />
      <Popover.Portal>
        <div css={css}>
          {spotlight && (
            <Box
              borderRadius={anchorRadius}
              part="tooltip-spotlight"
              position="absolute"
              css={{
                boxShadow: '0 0 0 2000px rgb(0 0 0 / 0.5)',
                height: anchorRect.height,
                left: anchorRect.left,
                top: anchorRect.top,
                width: anchorRect.width,
              }}
            />
          )}
          <Popover.Content asChild {...contentProps} ref={contentRef}>
            <Flex.Column
              backgroundColor="white"
              borderRadius="md"
              p={5}
              part="tooltip-content"
              position="relative"
              css={{
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                width: '300px',
                ...style,
              }}
            >
              <Dot style={dotPosition} />

              {children}
            </Flex.Column>
          </Popover.Content>
        </div>
      </Popover.Portal>
    </Popover.Root>
  )
}

Tooltip.Close = ({ css, ...props }: ButtonProps) => {
  return (
    <Popover.Close aria-label="Close" asChild>
      <Button.Plain
        css={[
          {
            top: 0,
            right: 0,
          },
          css,
        ]}
        part="tooltip-close"
        position="absolute"
        {...props}
      >
        <XMarkIcon height="20" fill="currentColor" />
      </Button.Plain>
    </Popover.Close>
  )
}

Tooltip.Media = ({ src, ...props }: MediaProps) => {
  if (src == null) return null

  return (
    <Media
      borderRadius="md md 0 0"
      borderWidth="0"
      css={{
        aspectRatio: '2',
      }}
      margin="-5 -5 5"
      src={src}
      {...props}
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
    <Text.Body2 fontWeight="demibold" part="progress" {...props}>
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

  return (
    <Text.Body2 part="subtitle" {...props}>
      {children}
    </Text.Body2>
  )
}

Tooltip.Title = ({ children, ...props }: TextProps) => {
  if (children == null) return null

  return (
    <Text.Body1 fontWeight="bold" mb={1} part="title" {...props}>
      {children}
    </Text.Body1>
  )
}
