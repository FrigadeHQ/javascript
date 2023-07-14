import * as React from 'react'
import { Button } from '../TEMP_index'

export default {
  title: 'Foundations/Button',
  component: Button,
}

export const Default = {
  decorators: [
    () => {
      return (
        <div
          style={{
            display: 'flex',
            flexFlow: 'column nowrap',
            gap: '12px',
            alignItems: 'flex-start',
          }}
        >
          <Button>Button</Button>
          <Button.Primary size="sm">Button.Primary size=sm</Button.Primary>
          <Button.Secondary>Button.Secondary</Button.Secondary>
          <Button.Secondary size="sm">Button.Secondary size=sm</Button.Secondary>
          <Button.Link>Button.Link</Button.Link>
          <Button.Plain>Button.Plain</Button.Plain>

          <Button
            overrides={{
              components: {
                Text: {
                  Body1: {
                    color: 'green500',
                  },
                },
              },
            }}
          >
            Button with theme
          </Button>

          <Button borderRadius="round">Button borderRadius=md</Button>
        </div>
      )
    },
  ],
}
