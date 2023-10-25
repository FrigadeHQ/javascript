export function getDotPosition({ props, alignAttr, sideAttr }) {
  const currentSide = sideAttr ?? 'bottom'
  const dotProps = {}

  // Radix's collision system isn't aware of our custom before|after align
  const currentAlign = (() => {
    if (['after', 'before'].includes(props.align)) {
      if (alignAttr == 'start') {
        return 'before'
      } else if (alignAttr == 'end') {
        return 'after'
      }
    }

    return props.align
  })()

  const dotOffset = '-24px'

  const oppositeSides = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }

  /* 
    Rules:
      - Dot is opposite to side prop (e.g. side=left -> dot=right)
      - align=before|end -> Dot goes to highest extent (right/bottom) of align-axis
      - align=after|start -> Dot goes to lowest extent (left/top) of align-axis
      - align=center -> Dot goes to the center
  */

  dotProps[oppositeSides[currentSide]] = dotOffset

  if (['before', 'end'].includes(currentAlign)) {
    if (['top', 'bottom'].includes(currentSide)) {
      dotProps['right'] = dotOffset
    } else {
      dotProps['bottom'] = dotOffset
    }
  } else if (['after', 'start'].includes(currentAlign)) {
    if (['top', 'bottom'].includes(currentSide)) {
      dotProps['left'] = dotOffset
    } else {
      dotProps['top'] = dotOffset
    }
  } else {
    // The only option left is align=center
    if (['top', 'bottom'].includes(currentSide)) {
      dotProps['left'] = `calc(50% + ${dotOffset})`
    } else {
      dotProps['top'] = `calc(50% + ${dotOffset})`
    }
  }

  return dotProps
}
