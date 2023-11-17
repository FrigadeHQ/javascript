import { tokens } from '../tokens'
import { flattenObject } from '../flattenObject'

function transformTokensToVars(obj, path = '--fr') {
  const newObj = {}

  Object.keys(obj).forEach((key) => {
    const currentValue = obj[key]

    if (typeof currentValue === 'object' && currentValue !== null && !Array.isArray(currentValue)) {
      newObj[key] = transformTokensToVars(currentValue, `${path}-${key}`)
    } else {
      newObj[key] = `var(${path}-${key})`
    }
  })

  return newObj
}

// Transform tokens to a flat list of CSS variables and values to inject into the page
// IN: { colors: { black: '#000' } }, OUT: { '--fr-colors-black': '#000' }
export const themeVariables = flattenObject(tokens, '--fr', '-')

// Swap token values out and replace them with the CSS variables we defined
// IN: { colors: { black: '#000' } }, OUT: { colors: { black: 'var(--fr-colors-black)' } }
export const theme = transformTokensToVars(tokens)
