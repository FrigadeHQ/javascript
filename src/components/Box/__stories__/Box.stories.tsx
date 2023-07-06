import React, { useEffect } from 'react'
import { Box } from '../index'
import { css } from 'styled-components'

import { Text } from '../../Text'

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
            css={{
              color: 'pink',

              '.foo': {
                color: 'purple',
              },
            }}
          >
            This should be pink.
            <div className="foo">Can we nest this?</div>
          </Box>
        </div>
      )
    },
  ],
}
