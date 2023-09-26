import { useContext } from 'react'
import { FrigadeContext } from '../FrigadeProvider'
import { Appearance } from '../types'

export function useTheme() {
  const { defaultAppearance } = useContext(FrigadeContext)

  function mergeAppearanceWithDefault(appearance?: Appearance): Appearance {
    const _appearance = JSON.parse(JSON.stringify(defaultAppearance))

    if (!appearance) {
      return _appearance
    }

    return {
      styleOverrides: Object.assign(
        _appearance.styleOverrides ?? {},
        appearance.styleOverrides ?? {}
      ),
      theme: Object.assign(_appearance.theme, appearance.theme ?? {}),
    }
  }

  return { mergeAppearanceWithDefault }
}
