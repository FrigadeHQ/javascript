import { setElementVars } from '@vanilla-extract/dynamic'
import { theme, tokens } from '../shared/theme.css'

export const updateTheme = (themeOverrides = {}) => {
  const mergedTheme = Object.assign({}, tokens, themeOverrides)

  const root = document.querySelector(':root') as HTMLElement

  // This doesn't need to be a hook
  // Also, can we dig in recursively to check like theme[level1][level2][foo]
  /// ...then override just one single value with setElementVars(root, [theme[level1][level2][foo]]: newValue) ?
  // Might allow us to avoid overriding every single theme var in the style attr.

  setElementVars(root, theme, mergedTheme)
}
