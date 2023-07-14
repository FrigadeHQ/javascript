import React from 'react'
import { Box } from '../index'

import { Text } from '../../Text'

import { appearanceToOverrides } from '../appearanceToOverrides'

export default {
  title: 'Foundations/Box',
  component: Box,
}

export const Default = {
  decorators: [
    () => (
      <div style={{ display: 'flex', flexFlow: 'column nowrap', gap: '12px' }}>
        <Box as="div">
          <div className="foo">Box as="div"</div>
        </Box>
      </div>
    ),
  ],
}

export const Test = {
  decorators: [
    () => {
      const testAppearance = {
        theme: {
          colorText: 'blue',
          colorTextSecondary: '#494949',
          colorTextOnPrimaryBackground: '#fff',
          colorPrimary: '#2956B5',
          colorBorder: '#E2E2E2',
        },
        styleOverrides: {
          testOverrideSelector: {
            backgroundColor: 'aquamarine',
          },
        },
      }

      const boxProps = appearanceToOverrides(testAppearance)

      console.log('overrides', boxProps)

      return (
        <div style={{ display: 'flex', flexFlow: 'column nowrap', gap: '12px' }}>
          <Text.Body1>This is normal Text.Body1</Text.Body1>

          <Box
            as="div"
            overrides={{
              components: {
                Text: {
                  Body1: {
                    fontSize: '10px',
                    color: 'red',
                  },
                },
              },
            }}
          >
            <Text.Body1>This Text.Body1 has been changed by the `overrides` prop.</Text.Body1>
          </Box>

          <Box
            mb="10"
            css={{
              color: 'purple',

              '.foo': {
                color: 'orange',
              },
            }}
          >
            This should be blurple, since we have access to the theme inside custom CSS.
            <div className="foo">But this nested selector is orange!</div>
          </Box>

          <Box {...boxProps}>
            <Text>This should be themed according to the appearance prop</Text>
            <div className="fr-testOverrideSelector">This is a simulation of an SDK className</div>
          </Box>
        </div>
      )
    },
  ],
}
