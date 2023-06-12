import React from 'react'
import { FrigadeTour } from '../index'

export default {
  title: 'Tour',
  component: FrigadeTour,
  decorators: [
    (Story: any) => (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <span id="tooltip-storybook-0">First tooltip attachment point</span>
        <Story />
      </div>
    ),
  ],
}

export const Tour = {
  args: {
    flowId: 'flow_bLdv0aEVsLgcDX1e',
    tooltipPosition: 'auto',
    dismissible: true,
  },
}
