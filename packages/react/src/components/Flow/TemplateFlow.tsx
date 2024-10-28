import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'
import { Flow } from '@/components/Flow'

import { flatDeserialize } from '@/components/Editor/serializer'

/*
Options for complex hydration cases:
components = {

  Object that contains the component to render as well as additional props to be merged in
  'Button.Primary': {
    component: Button.Primary,
    props: {
      onClick: handlePrimary
    }
  },

  Function that returns the final renderable React Element
  'Foo.Bar': (serializedElement) => React.Element

  Function that transforms the serialized element, which we will then pass into React.createElement()
  'Foo.Bar': (serializedElement) => serializedElement
}


flatDeserialize({
  template,
  components,
  variables: {
    flow,
    step
  }
})


"48aeeccd-0c2b-4a50-867a-31dc88a70c23": {
  "type": "Card.Title",
  "props": {},
  "children": "{step.title}"
},

*/

export function TemplateFlow(props) {
  return (
    <Flow {...props}>
      {({
        flow,
        handleDismiss,
        handlePrimary,
        handleSecondary,
        // parentProps: { dismissible, flowId, variables, containerProps },
        // step,
      }) => {
        const components = {
          'Button.Primary': {
            component: Button.Primary,
            props: {
              onClick: handlePrimary,
            },
          },
          'Button.Secondary': {
            component: Button.Secondary,
            props: {
              onClick: handleSecondary,
            },
          },
          Card: Card,
          'Card.Title': Card.Title,
          'Card.Subtitle': Card.Subtitle,
          'Flex.Row': Flex.Row,
        }

        const hydrated = flatDeserialize(flow.rawData.data.template, components)

        return hydrated
      }}
    </Flow>
  )
}
