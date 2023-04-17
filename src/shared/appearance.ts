import { Appearance } from '../types'

export const CSS_CLASS_PREFIX = 'fr-'
export const CUSTOM_CSS_STYLES_PREFIX = 'cfr-'
const defaultClass = '.fr-element'

export function getClassName(className: string, appearance?: Appearance) {
  const defaultClass = `${CSS_CLASS_PREFIX}${className}`
  if (!appearance) {
    return defaultClass
  }

  if (appearance.styleOverrides && appearance.styleOverrides[className]) {
    if (typeof appearance.styleOverrides[className] === 'string') {
      // It's a class name
      return defaultClass + ' ' + appearance.styleOverrides[className]
    } else if (typeof appearance.styleOverrides[className] === 'object') {
      // It's a style object
      return defaultClass + ' ' + CUSTOM_CSS_STYLES_PREFIX + className
    }
  }

  return defaultClass
}

export function getCustomClassOverrides(props: any) {
  if (!props.className) {
    return defaultClass
  }
  if (props.className.indexOf(CUSTOM_CSS_STYLES_PREFIX) !== -1) {
    return defaultClass
  }

  // Remove any extra spaces from props.customClasses. Only allow one space per class.
  const customClasses = props.className.replace(/\s+/g, ' ')
  const customClassesArray = customClasses.split(' ')
  if (customClassesArray.length == 1 && customClassesArray[0].startsWith(CSS_CLASS_PREFIX)) {
    return defaultClass
  }
  return customClassesArray
    .map((className: string) => {
      return `.${className}`
    })
    .join(', ')
}

export function toKebabKey(key: string) {
  return key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
}

export function styleOverridesToCSS(props: any) {
  return props?.styleOverrides
    ? Object.keys(props.styleOverrides)
        .map((key) => `${toKebabKey(key)}: ${props.styleOverrides[key]};`)
        .join(' ')
    : ''
}

export function mergeClasses(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function ucFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
