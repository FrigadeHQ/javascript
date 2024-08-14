export function getPingPosition(align, side) {
  const style = {}
  const pingOffset = '-12px'

  const oppositeSides = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }

  /* 
    Rules:
      - Ping is opposite to side prop (e.g. side=left -> ping=right)
      - align=before|end -> Ping goes to highest extent (right/bottom) of align-axis
      - align=after|start -> Ping goes to lowest extent (left/top) of align-axis
      - align=center -> Ping goes to the center
  */

  style[oppositeSides[side]] = pingOffset

  if (['before', 'end'].includes(align)) {
    if (['top', 'bottom'].includes(side)) {
      style['right'] = pingOffset
    } else {
      style['bottom'] = pingOffset
    }
  } else if (['after', 'start'].includes(align)) {
    if (['top', 'bottom'].includes(side)) {
      style['left'] = pingOffset
    } else {
      style['top'] = pingOffset
    }
  } else {
    // The only option left is align=center
    if (['top', 'bottom'].includes(side)) {
      style['left'] = `calc(50% + ${pingOffset})`
    } else {
      style['top'] = `calc(50% + ${pingOffset})`
    }
  }

  return style
}
