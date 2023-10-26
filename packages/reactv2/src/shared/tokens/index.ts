import { scalarTokens } from './scalarTokens'
import { semanticColors } from './semanticColors'

export { scalarTokens, semanticColors }

// Package up everything everywhere all at once for convenience
export const tokens = {
  ...scalarTokens,
  colors: {
    ...scalarTokens.colors,
    ...semanticColors,
  },
}
