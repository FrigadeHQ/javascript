import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { XMarkIcon } from '@heroicons/react/24/solid'
import * as Popover from '@radix-ui/react-popover'

import { useBoundingClientRect } from '../../hooks/useBoundingClientRect'
import { Box } from '../Box'
import { Button } from '../Button'
import { Text } from '../Text'
import { mapTooltipPropsToRadixProps } from './mapTooltipPropsToPopoverProps'

interface MergedRadixPopoverProps
  extends Pick<Popover.PopoverProps, 'defaultOpen' | 'modal' | 'onOpenChange' | 'open'>,
    Omit<Popover.PopoverContentProps, 'align' | 'asChild'> {}
export interface TooltipProps extends MergedRadixPopoverProps {
  anchor?: string
  style?: React.CSSProperties
  align?: Popover.PopoverContentProps['align'] | 'before' | 'after'
}

export function Tooltip({ anchor, style, ...props }: TooltipProps) {
  const { rect: contentRect, ref: contentRef } = useBoundingClientRect()

  // TEMP: Mock data
  const { title, subtitle, primaryButtonTitle } = {
    title: 'Hello world',
    subtitle: 'Very cool to meet you.',
    primaryButtonTitle: "Let's do this!",
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

  function getDotPosition() {
    const currentSide = props['side'] ?? 'bottom'
    const currentAlign = props['align'] ?? 'center'
    const dotProps = {}

    const dotOffset = '-24px'

    const oppositeSides = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    }

    /* 
      Dot position:

      side: top
        dot: bottom
        align:
          before | end
            dot: right
          after | start
            dot: left
      side: bottom
        dot: top
        align: same as side:top
      side: right
        dot: left
        align:
          before | end
            dot: bottom
          after | start
            dot: top


      Rules:
        - Dot is opposite to side prop (e.g. side=left -> dot=right)
        - align=before|end -> Dot goes to highest extent (right/bottom) of align-axis
        - align=after|start -> Dot goes to lowest extent (left/top) of align-axis
        - align=center -> Dot 
    */

    dotProps[oppositeSides[currentSide]] = dotOffset

    if (['before', 'end'].includes(currentAlign)) {
      if (['top', 'bottom'].includes(currentSide)) {
        console.log('dotprops right')
        dotProps['right'] = dotOffset
      } else {
        console.log('dotprops bottom')
        dotProps['bottom'] = dotOffset
      }
    } else if (['after', 'start'].includes(currentAlign)) {
      if (['top', 'bottom'].includes(currentSide)) {
        console.log('dotprops left')
        dotProps['left'] = dotOffset
      } else {
        console.log('dotprops top')
        dotProps['top'] = dotOffset
      }
    } else {
      // The only option left is align=center, which is wonky as hell, but we still need to handle it
      if (['top', 'bottom'].includes(currentSide)) {
        dotProps['left'] = `calc(50% + ${dotOffset})`
      } else {
        dotProps['top'] = `calc(50% + ${dotOffset})`
      }
    }

    return dotProps
  }

  const dotPosition = getDotPosition()

  console.log(dotPosition)

  return (
    <Popover.Root defaultOpen={true} {...rootProps}>
      <Popover.Anchor virtualRef={anchorElementRef} />
      <Popover.Portal>
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
            {/* Dot placeholder */}
            <Box
              style={{
                height: '48px',
                // left: '-24px',
                position: 'absolute',
                // top: '-24px',
                width: '48px',
                ...dotPosition,
              }}
            >
              <Box
                backgroundColor="primary.surface"
                style={{
                  borderRadius: '24px',
                  height: '48px',
                  left: 0,
                  opacity: 0.15,
                  position: 'absolute',
                  top: 0,
                  width: '48px',
                }}
              />
              <Box
                backgroundColor="primary.surface"
                style={{
                  borderRadius: '12px',
                  height: '24px',
                  left: '12px',
                  position: 'absolute',
                  top: '12px',
                  width: '24px',
                }}
              />
            </Box>

            {/* Image placeholder */}
            <Box
              backgroundColor="gray900"
              mb={5}
              mt={-5}
              mx={-5}
              style={{
                aspectRatio: '2',
              }}
            />

            <Text.Body1 fontWeight="bold" mb={1}>
              {title}
            </Text.Body1>
            <Text.Body2>{subtitle}</Text.Body2>

            <Box
              pt={4}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text.Body2 fontWeight="demibold">1/4</Text.Body2>
              <Button.Primary title={primaryButtonTitle ?? 'Ok'} />
            </Box>

            <Popover.Close
              aria-label="Close"
              style={{
                background: 'transparent',
                border: 0,
                position: 'absolute',
                top: 8,
                right: 0,
              }}
            >
              <XMarkIcon height="20" fill="black" />
            </Popover.Close>
          </Box>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
