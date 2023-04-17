import { ToolTipPosition } from './Tooltips'
import { useCallback, useEffect, useState } from 'react'

type BoundingRect = {
  left: number
  top: number
  width: number
  height: number
}

type Point = {
  x: number
  y: number
}

export const getPosition = (
  boundingRect: BoundingRect,
  position: ToolTipPosition,
  cardWidth: number,
  offset: Point = { x: 20, y: 20 },
  positionStyle: string
): Point => {
  const scrollY = positionStyle == 'fixed' ? 0 : window.scrollY
  const scrollX = positionStyle == 'fixed' ? 0 : window.scrollX

  if (!boundingRect || !boundingRect.left || !boundingRect.top) return { x: 0, y: 0 }

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

export type RectResult = {
  bottom: number
  height: number
  left: number
  right: number
  top: number
  width: number
  x: number
  y: number
}

const initialState = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0,
}

export function getRect<T extends Element>(element?: T | undefined | null): RectResult {
  let rect: RectResult = initialState
  if (element) {
    const domRect: DOMRect = element.getBoundingClientRect()
    rect = domRect
  }
  return rect
}

export function useElemRect(elem: Element | undefined, refresher?: any): RectResult {
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
