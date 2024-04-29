import { tokens, Tokens } from '@/shared/tokens'
import { flattenObject } from '@/shared/flattenObject'

import type { DeepPartial } from '@/shared/types'

export type Theme = DeepPartial<Tokens>

// Transform tokens to a flat list of CSS variables and values to inject into the page
// IN: { colors: { black: '#000' } }, OUT: { '--fr-colors-black': '#000' }
export function createThemeVariables(tokens: Theme) {
  const flattenedTokens = flattenObject(tokens, '--fr', '-')

  for (const [key, value] of Object.entries(flattenedTokens)) {
    if (key.indexOf('.') > -1) {
      const cssSafeKey = key.replace(/\./g, '-')

      flattenedTokens[cssSafeKey] = value
      delete flattenedTokens[key]
    }
  }

  return flattenedTokens
}

// Swap token values out and replace them with the CSS variables we defined
// IN: { colors: { black: '#000' } }, OUT: { colors: { black: 'var(--fr-colors-black)' } }
function mapTokensToThemeVariables(tokens: Tokens, path = '--fr'): Theme {
  const newObj: Theme = {}

  Object.keys(tokens).forEach((key) => {
    const currentValue = tokens[key]

    const cssSafeKey = key.replace(/\./g, '-')

    if (typeof currentValue === 'object' && currentValue !== null && !Array.isArray(currentValue)) {
      newObj[key] = mapTokensToThemeVariables(currentValue, `${path}-${key}`)
    } else {
      newObj[key] = `var(${path}-${cssSafeKey})`
    }
  })

  return newObj
}

export const themeVariables = createThemeVariables(tokens)

export const theme = mapTokensToThemeVariables(tokens)
