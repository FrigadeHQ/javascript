import * as React from 'react'
import type { Preview } from '@storybook/react'
import { FrigadeProvider } from '../src'

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
    (Story) => (
      <FrigadeProvider publicApiKey="api_public_JW1S9DKEAQ574EOVWIONV7BU8TB1MTA6L94NT4Q7TXC91AKKVORPDWDBAH6YP45D">
        <Story />
      </FrigadeProvider>
    ),
  ],
}

export default preview
