import { useEffect, useState } from 'react'
import { autoUpdate, type Placement, type ReferenceElement, useFloating } from '@floating-ui/react'

import { Overlay, type OverlayProps } from '@/components/Overlay'

export interface ClipPathCoords {
  maxX: number
  maxY: number
  radius: number
  x1: number
  x2: number
  y1: number
  y2: number
}

function getClipPath({ maxX, maxY, radius, x1, x2, y1, y2 }: ClipPathCoords) {
  if (radius > 0) {
    const instructions = [
      `M${x1 + radius},${y1}`,
      `H${x2 - radius}`,
      `A${radius} ${radius} 0,0,1 ${x2} ${y1 + radius}`,
      `V${y2 - radius}`,
      `A${radius} ${radius} 0,0,1 ${x2 - radius} ${y2}`,
      `H${x1 + radius}`,
      `A${radius} ${radius} 0,0,1 ${x1} ${y2 - radius}`,
      `V${maxY}`,
      `H${maxX}`,
      `V0`,
      `H0`,
      `V${maxY}`,
      `H${x1}`,
      `V${y1 + radius}`,
      `A${radius} ${radius} 0,0,1 ${x1 + radius} ${y1}`,
      `Z`,
    ]

    return `path("${instructions.join(' ')}")`
  }

  return `path("M${x1},${y1} H${x2} V${y2} H${x1} V${maxY} H${maxX} V0 H0 V${maxY} H${x1} Z")`
}

function getComputedRadius(element: ReferenceElement) {
  // Short circuit if we're not in a browser or if element is a VirtualElement
  if (!window || !('nodeType' in element)) {
    return 0
  }

  // NOTE: We currently only support single pixel lengths for radius
  // TODO: Allow complex radius syntax like 5px 5px 5px 5px, 5px / 10px, etc.
  const computedRadius = Number(window.getComputedStyle(element).borderRadius.replace(/\D/g, ''))

  return !Number.isNaN(computedRadius) ? computedRadius : 0
}

export interface SpotlightProps extends OverlayProps {
  anchor: string
}

export function Spotlight({ anchor, part, style = {}, ...props }: SpotlightProps) {
  const [clipPathCoords, setClipPathCoords] = useState<ClipPathCoords>({
    maxX: 0,
    maxY: 0,
    radius: 0,
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
  })

  const { refs } = useFloating({
    middleware: [
      {
        name: 'clipPath',
        fn({ elements, rects }) {
          setClipPathCoords({
            maxX: elements.floating.clientWidth,
            maxY: elements.floating.clientHeight,
            radius: getComputedRadius(elements.reference),
            x1: rects.reference.x,
            x2: rects.reference.x + rects.reference.width,
            y1: rects.reference.y,
            y2: rects.reference.y + rects.reference.height,
          })

          return {}
        },
      },
    ],
    open: true,
    placement: 'top-center' as Placement,
    transform: false,
    whileElementsMounted: autoUpdate,
  })

  useEffect(() => {
    try {
      const anchorQuery = document.querySelector(anchor)

      if (anchorQuery != null) {
        refs.setReference(anchorQuery)
      } else {
        console.debug(`[frigade] Spotlight: No anchor found for selector: ${anchor}`)
      }
    } catch (invalidSelector) {
      /* no-op */
    }
  }, [anchor, refs])

  return (
    <Overlay
      part={['spotlight', part]}
      ref={refs.setFloating}
      style={{
        clipPath: getClipPath(clipPathCoords),
        ...style,
      }}
      {...props}
    />
  )
}
