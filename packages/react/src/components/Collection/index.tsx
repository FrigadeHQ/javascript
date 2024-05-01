import { type Flow, FlowType } from '@frigade/js'
import { EmotionJSX } from '@emotion/react/types/jsx-namespace'
import { useContext, useEffect, useState } from 'react'

import { Announcement } from '@/components/Announcement'
import { Banner } from '@/components/Banner'
import { Card } from '@/components/Card'
import * as Checklist from '@/components/Checklist'
import { FrigadeContext } from '@/components/Provider'
import { Form } from '@/components/Form'
import * as Survey from '@/components/Survey'
import { Tour } from '@/components/Tour'

import { useCollection } from '@/hooks/useCollection'

// TODO: Accept props at top level of Collection component and put them onto a box, so we can style the contents of a Collection

// TODO: Sync type of flowComponents across to FlowType from API
// export type FlowComponentMap = {
//   [T in keyof typeof FlowType]: (props: unknown) => EmotionJSX.Element
// }

const flowTypeMap = {
  ANNOUNCEMENT: Announcement,
  BANNER: Banner,
  CARD: Card,
  CHECKLIST: Checklist.Collapsible,
  EMBEDDED_TIP: Card,
  FORM: Form,
  NPS_SURVEY: Survey.NPS,
  TOUR: Tour,
}

export function Collection({ collectionId }) {
  const { collection } = useCollection(collectionId)

  console.log(collection)

  const currentFlow = collection?.find(({ flow }) => flow.isVisible)?.flow

  const FlowComponent: EmotionJSX.ElementType =
    flowTypeMap[currentFlow?.rawData?.flowType] ?? (() => null)

  console.log('CURRENT: ', currentFlow)

  if (currentFlow == null || FlowComponent == null) {
    return null
  }

  return <FlowComponent flowId={currentFlow.id} />
}

// export function Collection({ collectionId }) {
//   const { frigade } = useContext(FrigadeContext)
//   const { collection } = useCollection(collectionId)
//   const [flows, setFlows] = useState([])

//   useEffect(() => {
//     if (collection == null) {
//       return
//     }
//     Promise.all(
//       collection.map(async ({ flowId }) => {
//         const flow = await frigade.getFlow(flowId)

//         console.log(flow)

//         if (flow == null) {
//           return null
//         }

//         const Component = flowTypeMap[flow.rawData.flowType]

//         if (Component == null) {
//           return null
//         }

//         return <Component key={flowId} flowId={flowId} />
//       })
//     ).then(setFlows)
//   }, [collection])

//   return flows
// }

/* export function Collection({ collectionId }) {
  // TODO: Make sure this component works with hasInitialized / initial batch registration
  const { frigade, hasInitialized, registerComponent, unregisterComponent } =
    useContext(FrigadeContext)

  // TODO: Ensure that this updates and causes a re-render when the visibility / state of the collection changes
  const { collection } = useCollection(collectionId)

  const [currentFlow, setCurrentFlow] = useState<Flow>()

  let currentFlowIndex = 0

  async function findVisibleFlow(): Promise<string | undefined> {
    if (collection == null || currentFlowIndex >= collection.length) {
      return undefined
    }

    const nextFlowId = collection[currentFlowIndex].flowId

    console.log('Next flow id: ', nextFlowId)

    return new Promise((resolve) => {
      // Check if component is already registered

      registerComponent(nextFlowId, (visible) => {
        console.log('Register callback called!')
        if (visible) {
          console.log('Visible: ', nextFlowId)
          // unregisterComponent(nextFlowId)
          resolve(nextFlowId)
        } else {
          console.log('Not visible: ', nextFlowId)
          // TODO: Check if this is necessary. I don't think so, but maybe? Ish?
          // unregisterComponent(nextFlowId)
          currentFlowIndex += 1
          resolve(findVisibleFlow())
        }
      })
    })
  }

  useEffect(() => {
    ;(async () => {
      const visibleFlowId = await findVisibleFlow()

      if (visibleFlowId == null) {
        return
      }

      const visibleFlow = await frigade.getFlow(visibleFlowId)

      setCurrentFlow(visibleFlow)
    })()

    // TODO: Unregister any registered flows on unmount
  }, [collection])

  if (collection == null || collection?.length === 0 || currentFlow == null) {
    return null
  }

  const FlowComponent: EmotionJSX.ElementType =
    flowTypeMap[currentFlow.rawData.flowType] ?? (() => null)

  return <FlowComponent flowId={currentFlow.id} />
} */
