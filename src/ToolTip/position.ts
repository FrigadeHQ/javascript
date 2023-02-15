import { ToolTipPosition } from './Tooltip'

type BoundingRect = {
  x: number
  y: number
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

  if (!boundingRect || !boundingRect.x || !boundingRect.y) return { x: 0, y: 0 }

  if (position === 'left') {
    return {
      x: boundingRect.x - cardWidth - offset.x + scrollX,
      y: boundingRect.y - offset.y + scrollY,
    }
  } else if (position === 'right') {
    return {
      x: boundingRect.x + boundingRect.width + offset.x + scrollX,
      y: boundingRect.y - offset.y + scrollY,
    }
  }

  return { x: 0, y: 0 }
}
