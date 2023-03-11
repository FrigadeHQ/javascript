import { Appearance } from '../types'

const prefix = 'fr-'
export function getClassName(className: string, appearance?: Appearance) {
  const defaultClass = `${prefix}${className}`
  if (!appearance) {
    return defaultClass
  }

  if (
    appearance.styleOverrides &&
    appearance.styleOverrides[className] &&
    typeof appearance.styleOverrides[className] === 'string'
  ) {
    return defaultClass + ' ' + appearance.styleOverrides[className]
  }

  return defaultClass
}

const defaultClass = '.fr-element'

export function getCustomClassOverrides(props: any) {
  if (!props.className) {
    return defaultClass
  }
  // Remove any extra spaces from props.customClasses. Only allow one space per class.
  const customClasses = props.className.replace(/\s+/g, ' ')
  const customClassesArray = customClasses.split(' ')
  if (customClassesArray.length == 1 && customClassesArray[0].startsWith(prefix)) {
    return defaultClass
  }
  return customClassesArray
    .map((className: string) => {
      return `.${className}`
    })
    .join(', ')
}
