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
