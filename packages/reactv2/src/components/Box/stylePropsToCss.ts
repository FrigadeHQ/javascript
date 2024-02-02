import { pseudoStyleProps, styleProps, stylePropShorthands } from './styleProps'

/*
Prefix these props to allow for usage in CSS & HTML:
  color
  - HTML: obsolete

  background
  - HTML: obsolete

  border
  - HTML: obsolete

  content
  - HTML: only used in <meta>, not relevant to components

  translate
  - used by both. Prefix _translate to force pass-through to HTML?


  height
  width
  - HTML: used by <canvas>, <embed>, <iframe>, <img>, <input>, <object>, <video>
  - Can automatically send these to both HTML and CSS for those elements and allow manual prefixing just in case (like if you want to set HTML width to something different that CSS width)

*/

function prepValue(value: unknown) {
  if (Array.isArray(value)) {
    return new Map(value.map((v) => [v, v]))
  } else if (typeof value === 'object' && value !== null) {
    return new Map(Object.entries(value))
  } else if (typeof value === 'string' || typeof value === 'number') {
    return new Map([[value, value]])
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

// TL;DR: Replaced elements should always have width & height HTML attrs set because intrinsic height / width = aspect ratio
const preservedProps = new Set(['height', 'width'])
const elementsWithPreservedProps = new Set([
  'canvas',
  'embed',
  'iframe',
  'img',
  'input',
  'object',
  'video',
])

function getPseudoClass(propName: string) {
  // We're intentionally only grabbing the initial name and first pseudo class for now
  // We can support styleProp:hover:focus easily enough by running through the whole array
  const [name, pseudo] = propName.split(':')

  return [name, pseudoStyleProps.has(pseudo) ? pseudo : null]
}

export function stylePropsToCss(
  props: Record<string, unknown>,
  element: React.ElementType = 'div'
) {
  const unmatchedProps = Object.assign({}, props)
  const cssFromProps = {}

  function getTargetObject(pseudo: string | null) {
    if (pseudo == null) {
      return cssFromProps
    }

    const hyphenatedPseudo = pseudo.replace(/[A-Z]/g, (match) => `-${match.toLocaleLowerCase()}`)

    const pseudoSelector = `&:${hyphenatedPseudo}`

    if (cssFromProps[pseudoSelector] == null) {
      cssFromProps[pseudoSelector] = {}
    }

    return cssFromProps[pseudoSelector]
  }

  // Convert shorthand styleProps to full versions
  Object.entries(unmatchedProps).forEach(([propName, propValue]) => {
    const [name, pseudo] = getPseudoClass(propName)

    const matchedShorthand = stylePropShorthandsMap.get(name)
    if (matchedShorthand != null) {
      matchedShorthand.forEach((p) => {
        const fullPropName = `${p}${pseudo ? ':' + pseudo : ''}`
        unmatchedProps[fullPropName] = propValue
      })

      delete unmatchedProps[propName]
    }
  })

  // Convert styleProps to style object
  Object.entries(unmatchedProps).forEach(([fullPropName, propValue]) => {
    const [propName, pseudo] = getPseudoClass(fullPropName)
    const styleProp = stylePropsMap.get(propName)

    if (styleProp != null) {
      // Split space-separated values out and process them individually
      if (typeof propValue === 'string' && propValue.indexOf(' ') > -1) {
        const splitPropValues = propValue.split(' ')

        getTargetObject(pseudo)[propName] = splitPropValues
          .map((v) => styleProp.get(v.toString()) ?? v)
          .join(' ')
      }

      // Replace known token values (e.g. lineHeight="xl")
      else if (styleProp.has(propValue.toString())) {
        getTargetObject(pseudo)[propName] = styleProp.get(propValue.toString())
      }

      // Pass value through, we trust TypeScript to catch invalid values, right?
      else {
        getTargetObject(pseudo)[propName] = propValue
      }

      // Don't delete the special props that get passed through to certain tags by default
      if (
        typeof element !== 'string' ||
        !elementsWithPreservedProps.has(element) ||
        !preservedProps.has(propName)
      ) {
        delete unmatchedProps[fullPropName]
      }
    }
  })

  // Remove prefix from prefixed style props and pass them through
  Object.keys(unmatchedProps).forEach((propName) => {
    const clippedPropName = propName.substring(1)

    if (propName.indexOf('_') === 0 && stylePropsMap.has(clippedPropName)) {
      unmatchedProps[clippedPropName] = unmatchedProps[propName]

      delete unmatchedProps[propName]
    }
  })

  return { cssFromProps, unmatchedProps }
}
