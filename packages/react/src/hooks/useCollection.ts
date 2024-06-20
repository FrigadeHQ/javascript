import { useContext, useEffect, useState } from 'react'
import type { EnrichedCollection } from '@frigade/js'

import { FrigadeContext } from '@/components/Provider'

import { useFlow } from '@/hooks/useFlow'

export function useCollection(collectionId: string) {
  const [collection, setCollection] = useState<EnrichedCollection>()
  const [currentFlowId, setCurrentFlowId] = useState<string>()
  const { flow: currentFlow } = useFlow(currentFlowId)
  const { frigade } = useContext(FrigadeContext)

  useEffect(() => {
    ;(async () => {
      const apiCollection = await frigade.getCollection(collectionId)

      if (!apiCollection || frigade.hasFailedToLoad()) {
        setCollection(undefined)
        return
      }

      const foundFlow = apiCollection.flows.find(({ flow }) => flow.isVisible)?.flow

      if (foundFlow != null && foundFlow.id !== currentFlowId) {
        setCurrentFlowId(foundFlow.id)
      }

      setCollection(apiCollection)
    })()
  }, [collectionId, currentFlow?.isVisible])

  return { collection, currentFlow }
}
