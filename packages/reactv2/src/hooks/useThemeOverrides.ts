import { setElementVars } from '@vanilla-extract/dynamic'
import { useEffect } from 'react'

import { mapThemePropToThemeVars } from '../shared/mapThemePropToThemeVars'

export function useThemeOverrides(themeOverrides, selector = 'body') {
  useEffect(() => {
    const mappedThemeVars = mapThemePropToThemeVars(themeOverrides)
    const root: HTMLElement = document.querySelector(selector)
    setElementVars(root, mappedThemeVars)
  }, [themeOverrides])
}
