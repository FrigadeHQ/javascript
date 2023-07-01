import React, { useEffect } from 'react'
import { Box } from '../index'

import { Text } from '../../Text'

import { theme } from '../../../shared/theme.css'

export default {
  title: 'Foundations/Box',
  component: Box,
}

export const Default = {
  decorators: [
    () => (
      <div style={{ display: 'flex', flexFlow: 'column nowrap', gap: '12px' }}>
        <Box as="div" style={{ backgroundColor: 'red' }}>
          <div className="foo">Box as="div"</div>
        </Box>
      </div>
    ),
  ],
}

export const Test = {
  decorators: [
    () => {
      const el = React.useRef(null)

      // useEffect(() => {
      //   // Create our shared stylesheet:
      //   const sheet = new CSSStyleSheet()
      //   sheet.replaceSync('* { color: red; }')

      //   if (el.current) {
      //     const shadow = el.current.attachShadow({ mode: 'open' })
      //     shadow.adoptedStyleSheets = [sheet]
      //   }
      // }, [el.current])

      console.log('MAYBE? ', theme.components.Text.Body1)
      return (
        <div
          ref={(ref) => (el.current = ref)}
          style={{ display: 'flex', flexFlow: 'column nowrap', gap: '12px' }}
        >
          <Box
            as="div"
            overrides={{
              Text: {
                Body1: {
                  fontSize: '10px',
                  color: 'red',
                },
              },
            }}
          >
            <Text.Body1>Testing</Text.Body1>
          </Box>
        </div>
      )
    },
  ],
}
