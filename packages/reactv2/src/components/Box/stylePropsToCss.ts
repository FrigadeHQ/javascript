import { styleProps } from './styleProps'

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

export function stylePropsToCss(props: Record<any, any>) {
  const unmatchedProps = Object.assign({}, props)
  const cssFromProps = {}

  Object.entries(props).forEach(([key, value]) => {
    if (typeof value === 'string' && stylePropsMap.get(key)?.has(value)) {
      cssFromProps[key] = stylePropsMap.get(key).get(value)
      delete unmatchedProps[key]
    }
  })

  return { cssFromProps, unmatchedProps }
}
