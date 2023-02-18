import { ToolTipPosition } from './Tooltip'

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
  offset: Point = { x: 20, y: 20 }
): Point => {
  const scrollY = window.scrollY
  const scrollX = window.scrollX

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
