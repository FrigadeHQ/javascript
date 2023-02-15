import { CSSProperties } from 'react'
import { CheckListPosition } from './Checklist'

const OFFSET_DEFAULT = '20px'

export const getPositionStyle = (
  position: CheckListPosition,
  offset: number | string = OFFSET_DEFAULT
): CSSProperties => {
  const verticalStyle = { top: offset }
  const horizontalStyle: CSSProperties = {}

  if (position.includes('left')) {
    horizontalStyle.left = offset
  } else if (position.includes('right')) {
    horizontalStyle.right = offset
  } else {
    horizontalStyle.left = 0
    horizontalStyle.right = 0
  }

  return {
    ...horizontalStyle,
    ...verticalStyle,
  }
}
