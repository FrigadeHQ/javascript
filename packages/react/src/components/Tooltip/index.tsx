import React, { useEffect, useRef, useState } from 'react'

import { XMarkIcon } from '@heroicons/react/24/solid'
import * as Popover from '@radix-ui/react-popover'

import { useBoundingClientRect } from '../../hooks/useBoundingClientRect'
import { Box, type BoxProps } from '../Box'
import { Button, ButtonProps } from '../Button'
import { Card } from '../Card'
import { Dot } from './Dot'
import { Media, MediaProps } from '../Media'
import { Text, TextProps } from '../Text'
import { getDotPosition } from './getDotPosition'
import { mapTooltipPropsToPopoverProps } from './mapTooltipPropsToPopoverProps'

export interface MergedRadixPopoverProps
  extends Pick<Popover.PopoverProps, 'defaultOpen' | 'modal' | 'onOpenChange' | 'open'>,
    Omit<Popover.PopoverContentProps, 'align' | 'asChild' | 'color' | 'content' | 'translate'> {}
export interface TooltipProps extends BoxProps, MergedRadixPopoverProps {
  /**
   * How to align the Tooltip relative to the anchor.
   * Uses the same notation as the `align` property in [Radix Popover](https://www.radix-ui.com/primitives/docs/components/popover).
   */
  align?: Popover.PopoverContentProps['align'] | 'before' | 'after'
  /**
   * @ignore
   */
  anchor?: string
  /**
   * Whether to show a spotlight behind the anchor. This will darken the rest of the page and highlight the anchor.
   */
  spotlight?: boolean
  /**
   * The Z-index of the tooltip. Defaults to auto.
   */
  zIndex?: number | string
  style?: React.CSSProperties
}

export function Tooltip({
  anchor,
  children,
  className,
  spotlight = false,
  style,
  ...props
}: TooltipProps) {
  const { node: contentNode, rect: contentRect, ref: contentRef } = useBoundingClientRect()
  const { node: anchorNode, rect: anchorRect, ref: anchorRef } = useBoundingClientRect()
  const { contentProps, otherProps, rootProps } = mapTooltipPropsToPopoverProps(props, contentRect)

  const [alignAttr, setAlignAttr] = useState(contentProps.align)
  const [sideAttr, setSideAttr] = useState(contentProps.side)
  const [spotlightLeft, setSpotlightLeft] = useState(0)
  const [spotlightTop, setSpotlightTop] = useState(0)

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

  // Radix requires a separate ref to pass anchor through into Popover.Anchor
  const anchorVirtualRef = useRef(null)

  useEffect(() => {
    const anchorQuery = document.querySelector(anchor)

    if (anchorQuery != null) {
      anchorRef(anchorQuery)
      anchorVirtualRef.current = anchorQuery
    } else {
      console.debug(`[frigade] Tooltip: No anchor found for query: ${anchor}`)
    }
  }, [anchor])

  useEffect(() => {
    function checkElementForAnchor(element: Element) {
      if (element.matches(anchor)) {
        return element
      }

      const anchorSelector = element.querySelectorAll(anchor)

      if (anchorSelector.length > 0) {
        return anchorSelector[0]
      }

      return null
    }

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== 'childList') {
          continue
        }

        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) {
            continue
          }

          const maybeAnchor = checkElementForAnchor(node as Element)

          if (maybeAnchor != null) {
            anchorRef(maybeAnchor)
            anchorVirtualRef.current = maybeAnchor

            console.debug('[frigade] Tooltip: MutationObserver added anchor: ', maybeAnchor)

            break
          }
        }

        for (const node of mutation.removedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) {
            continue
          }

          const maybeAnchor = checkElementForAnchor(node as Element)

          if (maybeAnchor != null) {
            anchorRef(null)
            anchorVirtualRef.current = null

            console.debug('[frigade] Tooltip: MutationObserver removed anchor: ', maybeAnchor)

            break
          }
        }
      }
    })

    observer.observe(document.querySelector('body'), { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const { scrollX, scrollY } = window

    setSpotlightLeft(anchorRect.left + scrollX)
    setSpotlightTop(anchorRect.top + scrollY)
  }, [anchorRect.left, anchorRect.top])

  if (anchorNode == null) {
    return null
  }

  let anchorRadius = '0'
  if (typeof window !== 'undefined') {
    anchorRadius = window.getComputedStyle(anchorNode).borderRadius
  }

  const dotPosition = getDotPosition({ props, alignAttr, sideAttr })

  return (
    <Popover.Root defaultOpen={true} {...rootProps}>
      <Popover.Anchor virtualRef={anchorVirtualRef} />
      <Popover.Portal>
        <>
          {spotlight && (
            <Box
              boxShadow="0 0 0 20000px rgb(0 0 0 / 0.5)"
              part="tooltip-spotlight"
              pointerEvents="none"
              position="absolute"
              style={{
                borderRadius: anchorRadius,
                height: anchorRect.height,
                left: spotlightLeft,
                top: spotlightTop,
                width: anchorRect.width,
              }}
              {...(props.zIndex != null
                ? {
                    zIndex: props.zIndex,
                  }
                : {})}
            />
          )}
          <Popover.Content asChild {...contentProps} ref={contentRef}>
            <Card
              boxShadow="md"
              part="tooltip"
              position="relative"
              className={className}
              css={{
                maxWidth: '360px',
                pointerEvents: 'auto',
              }}
              style={style}
              {...otherProps}
            >
              <Dot style={dotPosition} />

              {children}
            </Card>
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
          top: '12px',
          right: '4px',
        }}
        part="close"
        position="absolute"
        {...props}
      >
        <XMarkIcon height="24" fill="currentColor" />
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
        objectFit: 'cover',
      }}
      margin="-5 -5 0"
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
    <Text.H4 part="progress" {...props}>
      {children}
    </Text.H4>
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
    <Text.H4 part="title" {...props}>
      {children}
    </Text.H4>
  )
}
