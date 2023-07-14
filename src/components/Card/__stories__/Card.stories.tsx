import * as React from 'react'
import { Card } from '../Card'

import { Text } from '../../Text'

export default {
  title: 'Foundations/Card',
  component: Card,
}

export const Default = {
  decorators: [
    () => {
      return (
        <Card dismissible>
          <Text.H3>Hello world</Text.H3>
          <Text>This is a card.</Text>
        </Card>
      )
    },
  ],
}
