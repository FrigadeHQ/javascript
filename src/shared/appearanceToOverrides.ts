import { deepmerge } from './deepmerge'

const THEME_MAP = {
  // { oldThemeKey: 'path.to.new.theme.token' }
  colorPrimary: 'colors.primary.background',
  colorText: 'colors.neutral.foreground',
  colorBackground: 'colors.neutral.background',
  colorBackgroundSecondary: 'colors.secondary.background',
  colorTextOnPrimaryBackground: 'colors.primary.foreground',
  colorTextSecondary: 'colors.secondary.foreground',
  colorTextDisabled: 'colors.gray700',
  colorBorder: 'colors.gray800',
  colorTextError: 'colors.negative.foreground',
  borderRadius: 'radii.lg',
}

// Convert appearance.theme prop (old) to theme tokens for overrides prop (new)
function themeToTokens(theme) {
  if (!theme) return undefined

  const overrides = {}

  Object.entries(theme).forEach(([key, value]) => {
    if (THEME_MAP[key]) {
      // Step 1: 'foo.bar.baz' -> ['foo', 'bar', 'baz']
      const levels = THEME_MAP[key].split('.')

      // Step 2: ['foo', 'bar', 'baz'] -> { foo: { bar: { baz: value } } }
      let currentLevel = overrides
      levels.forEach((nextLevel, i) => {
        if (!currentLevel[nextLevel]) {
          currentLevel[nextLevel] = i === levels.length - 1 ? value : {}
        }

        currentLevel = currentLevel[nextLevel]
      })
    }
  })

  return overrides
}

function styleOverridesToCSS(styleOverrides) {
  // Walk overrides and convert them to CSS descendent selectors
  // ...that's pretty much it?
  if (!styleOverrides) return undefined

  // We don't want to reference the original object
  const copiedOverrides = deepmerge({}, styleOverrides)

  const css = {}

  Object.keys(copiedOverrides).forEach((oldSelector) => {
    const newSelector = `.fr-${oldSelector}`

    css[newSelector] = copiedOverrides[oldSelector]
  })

  return css
}

export function appearanceToOverrides(appearance) {
  const { theme, styleOverrides } = appearance

  const overrides = themeToTokens(theme)
  const css = styleOverridesToCSS(styleOverrides)

  return {
    overrides,
    css,
  }
}
