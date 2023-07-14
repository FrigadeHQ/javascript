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
          <Button title="Button" />
          <Button.Primary size="sm" title="Button.Primary size=sm" />
          <Button.Secondary title="Button.Secondary" />
          <Button.Secondary size="sm" title="Button.Secondary size=sm" />
          <Button.Link title="Button.Link" />
          <Button.Plain title="Button.Plain" />

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
            title="Button with theme"
          />

          <Button borderRadius="round" title="Button borderRadius=md" />
        </div>
      )
    },
  ],
}
