import React from 'react'
import { Text } from '../index'
import { fontWeights, textVariants } from '../styled'

export default {
  title: 'Foundations/Text',
  component: Text,
}

export const Default = {
  decorators: [
    () => (
      <div style={{ display: 'flex', flexFlow: 'column nowrap', gap: '12px' }}>
        {Object.keys(textVariants).map((variant, i) => {
          const Component = Text[variant]

          if (['Body1', 'Body2', 'Caption'].includes(variant)) {
            return Object.keys(fontWeights).map((weight) => (
              <Component key={`${i}-${weight}`} fontWeight={weight}>
                Text.{variant} {weight}
              </Component>
            ))
          }

          return <Component key={i}>Text.{variant}</Component>
        })}
      </div>
    ),
  ],
}
