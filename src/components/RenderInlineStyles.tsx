import React from 'react'
import { Appearance } from '../types'
import { createGlobalStyle } from 'styled-components'
import { CUSTOM_CSS_STYLES_PREFIX, toKebabKey } from '../shared/appearance'

export function RenderInlineStyles({ appearance }: { appearance?: Appearance }) {
  if (!appearance || !appearance.styleOverrides) {
    return <></>
  }
  const inlineStyles = Object.entries(appearance.styleOverrides).filter(([key, value]) => {
    return typeof value === 'object'
  })

  if (inlineStyles.length === 0) {
    return <></>
  }

  const GlobalStyleComponent = createGlobalStyle`
${(props) =>
  props.inlineStyles
    .map(([key, value]) => {
      return `.${CUSTOM_CSS_STYLES_PREFIX}${key}.${CUSTOM_CSS_STYLES_PREFIX}${key} { ${Object.entries(
        value
      )
        .map(([key, value]) => {
          let kebabKey = toKebabKey(key)

          return `${kebabKey}: ${value};`
        })
        .join(' ')} }`
    })
    .join(' ')}`

  return <GlobalStyleComponent inlineStyles={inlineStyles} />
}
