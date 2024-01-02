import type { CSSProperties } from 'react'

import { styleProps, stylePropShorthands } from './styleProps'

export type StyleProps = Omit<{
  [key in keyof CSSProperties]: CSSProperties[key][]
}, `-${string}` | `Moz${string}` | `ms${string}` | `Webkit${string}` | `Khtml${string}` | `O${string}`>

function prepValue(value: any) {
  if (Array.isArray(value)) {
    return new Map(value.map((v) => [v, v]))
  } else if (typeof value === 'object' && value !== null) {
    return new Map(Object.entries(value))
  } else if (['string', 'number'].includes(typeof value)) {
    return new Map([value, value])
  }

  return new Map()
}

const stylePropsMap = new Map(
  Object.entries(styleProps).map(([propName, value]) => {
    return [propName, prepValue(value)]
  })
)

const stylePropShorthandsMap = new Map(
  Object.entries(stylePropShorthands).map(([shorthand, targetProps]) => {
    return [shorthand, new Set(targetProps)]
  })
)

export function stylePropsToCss(props: Record<any, any>) {
  const unmatchedProps = Object.assign({}, props)
  const cssFromProps = {}

  // Convert shorthand styleProps to full versions
  Object.entries(unmatchedProps).forEach(([propName, propValue]) => {
    const matchedShorthand = stylePropShorthandsMap.get(propName)
    if (matchedShorthand != null) {
      matchedShorthand.forEach((propName) => {
        unmatchedProps[propName] = propValue
      })

      delete unmatchedProps[propName]
    }
  })

  // Convert styleProps to style object
  Object.entries(unmatchedProps).forEach(([propName, propValue]) => {
    const styleProp = stylePropsMap.get(propName)
    if (styleProp != null) {
      // Split space-separated values out and process them individually
      if (typeof propValue === 'string' && propValue.indexOf(' ') > -1) {
        const splitPropValues = propValue.split(' ')

        cssFromProps[propName] = splitPropValues
          .map((v) => styleProp.get(v.toString()) ?? v)
          .join(' ')

        // Replace known token values (e.g. lineHeight="xl")
      } else if (styleProp.has(propValue.toString())) {
        cssFromProps[propName] = styleProp.get(propValue.toString())

        // Pass value through, we trust TypeScript to catch invalid values, right?
      } else {
        cssFromProps[propName] = propValue
      }

      delete unmatchedProps[propName]
    }
  })

  return { cssFromProps, unmatchedProps }
}
