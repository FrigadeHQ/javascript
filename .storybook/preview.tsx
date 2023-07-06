import * as React from 'react'
import type { Preview } from '@storybook/react'
import { FrigadeProvider } from '../src'

import './preview.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <FrigadeProvider
          publicApiKey="api_public_GY6O5JS99XTL2HAXU0D6OQHYQ7I706P5I9C9I7CEZFNFUFRARD2DVDSMFW3YT3SV"
          userId="jonathan_livingston_smeagol"
          config={{
            theme: {
              color: {
                // black: 'blue',
              },
            },
          }}
        >
          <Story />
        </FrigadeProvider>
      )
    },
  ],
}

export default preview
