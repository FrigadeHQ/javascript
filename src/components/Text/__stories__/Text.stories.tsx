import React from 'react'
import { Text } from '../index'
import { textVariantNames } from '../textRecipe.css'

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

          return <Component key={i}>Text.{variant}</Component>
        })}
      </div>
    ),
  ],
}
