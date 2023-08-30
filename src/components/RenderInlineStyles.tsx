import React from 'react'
import { Appearance } from '../types'
import { createGlobalStyle } from 'styled-components'
import { CUSTOM_CSS_STYLES_PREFIX, toKebabKey } from '../shared/appearance'

const GlobalStyleComponent = createGlobalStyle`
${(props) =>
  props.inlineStyles
    .map(([key, value]) => {
      return `.${CUSTOM_CSS_STYLES_PREFIX}${key}.${CUSTOM_CSS_STYLES_PREFIX}${key} { ${Object.entries(
        value
      )
        .map(([key, value]) => {
          if (typeof value === 'object') {
            // This is a selector. Render it.
            return `${key} { ${Object.entries(value)
              .map(([nestedKey, nestedValue]) => {
                let kebabKey = toKebabKey(nestedKey)

                return `${kebabKey}: ${nestedValue};`
              })
              .join(' ')} }`
          }

          let kebabKey = toKebabKey(key)

          return `${kebabKey}: ${value};`
        })
        .join(' ')} }`
    })
    .join(' ')}`

export function RenderInlineStyles({ appearance }: { appearance?: Appearance }) {
  if (!appearance || !appearance.styleOverrides) {
    return <></>
  }
  const inlineStyles = Object.entries(appearance.styleOverrides).filter(([_, value]) => {
    return typeof value === 'object'
  })

  if (inlineStyles.length === 0) {
    return <></>
  }

  return <GlobalStyleComponent inlineStyles={inlineStyles} />
}
