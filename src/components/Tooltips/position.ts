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

const initialState = new DOMRect()

export function getRect<T extends Element>(element?: T | undefined | null): DOMRect {
  let rect: DOMRect = initialState
  if (element) {
    const domRect: DOMRect = element.getBoundingClientRect()
    rect = domRect
  }

  return rect
}

export function useElemRect(elem: Element | undefined, refresher?: any): DOMRect {
  const [dimensions, setDimensions] = useState(initialState)
  const handleResize = useCallback(() => {
    if (!elem) return
    setDimensions(getRect(elem))
  }, [elem])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [elem, refresher])

  return dimensions
}
