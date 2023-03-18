import React from 'react'
import { Appearance } from '../types'
import { createGlobalStyle } from 'styled-components'
import { CUSTOM_CSS_STYLES_PREFIX } from '../shared/appearance'

export function RenderInlineStyles({ appearance }: { appearance?: Appearance }) {
  if (!appearance || !appearance.styleOverrides) {
    return <></>
  }
  // Find all appearance.styleOverrides that contain CSS Properties

  // Create a GlobalStyle component that contains all the CSS Properties

  // Return the GlobalStyle component

  const inlineStyles = Object.entries(appearance.styleOverrides).filter(([key, value]) => {
    return typeof value === 'object'
  })

  if (inlineStyles.length === 0) {
    return <></>
  }

  const GlobalStyleComponent = createGlobalStyle`
    ${inlineStyles.map(([key, value]) => {
      return `.${CUSTOM_CSS_STYLES_PREFIX}${key}.${CUSTOM_CSS_STYLES_PREFIX}${key} { ${Object.entries(
        value
      ).map(([key, value]) => {
        const kebabKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
        return `${kebabKey}: ${value};`
      })} }`
    })}`

  return <GlobalStyleComponent />
}
