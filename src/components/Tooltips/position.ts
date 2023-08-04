import { ToolTipPosition } from './Tooltips'
import { useCallback, useEffect, useState } from 'react'

type Point = {
  x: number
  y: number
}

export const getPosition = (
  boundingRect: DOMRect,
  position: ToolTipPosition,
  cardWidth: number,
  offset: Point = { x: 20, y: 20 },
  positionStyle: string
): Point => {
  const scrollY = positionStyle == 'fixed' ? 0 : window.scrollY
  const scrollX = positionStyle == 'fixed' ? 0 : window.scrollX

  if (position === 'left') {
    return {
      x: boundingRect.left - cardWidth + offset.x + scrollX,
      y: boundingRect.top - offset.y + scrollY,
    }
  } else if (position === 'right') {
    return {
      x: boundingRect.left + boundingRect.width + offset.x + scrollX,
      y: boundingRect.top - offset.y + scrollY,
    }
  }

  return { x: 0, y: 0 }
}

export function useElemRect(elem: Element | undefined, refresher?: any): DOMRect {
  // Spoof DOMRect for server renders
  const initialRect =
    'DOMRect' in globalThis
      ? new DOMRect()
      : {
          height: 0,
          width: 0,
          x: 0,
          y: 0,
          bottom: 0,
          top: 0,
          right: 0,
          left: 0,
          toJSON: () => {},
        }

  const [dimensions, setDimensions] = useState(initialRect)
  const handleResize = useCallback(() => {
    if (!elem) return
    setDimensions(elem.getBoundingClientRect())
  }, [elem])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [elem, refresher])

  return dimensions
}
