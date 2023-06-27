import React from 'react'
import { Text } from '../index'
import { textVariantNames, textWeightNames } from '../textRecipe.css'

export default {
  title: 'Foundations/Text',
  component: Text,
}

export const Default = {
  decorators: [
    () => (
      <div style={{ display: 'flex', flexFlow: 'column nowrap', gap: '12px' }}>
        {textVariantNames.map((variant, i) => {
          const Component = Text[variant]

          if (['Body1', 'Body2', 'Caption'].includes(variant)) {
            return textWeightNames.map((weight) => (
              <Component key={`${i}-${weight}`} weight={weight}>
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
