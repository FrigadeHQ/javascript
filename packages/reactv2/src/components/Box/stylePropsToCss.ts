import { styleProps, stylePropShorthands } from './styleProps'

function prepValue(value) {
  if (Array.isArray(value)) {
    return new Map(value.map((v) => [v, v]))
  } else if (typeof value === 'object' && value !== null) {
    return new Map(Object.entries(value))
  } else if (['string', 'number'].includes(typeof value)) {
    return new Map([value, value])
  }

  throw new Error('Invalid entry in styleProps')
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
      if (typeof propValue === 'string' && propValue.indexOf(' ') > -1) {
        // Split space-separated values out and process them individually
        const splitPropValues = propValue.split(' ')

        cssFromProps[propName] = splitPropValues
          .map((v) => styleProp.get(v.toString()) ?? v)
          .join(' ')

        delete unmatchedProps[propName]
      } else if (styleProp.has(propValue.toString())) {
        cssFromProps[propName] = styleProp.get(propValue.toString())
        delete unmatchedProps[propName]
      }
    }
  })

  return { cssFromProps, unmatchedProps }
}
