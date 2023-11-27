import { Flow, Frigade } from '@frigade/js'
import { useContext, useEffect, useRef, useState } from 'react'

import { FrigadeContext } from '../components/Provider'

export function useFlow(flowId: string) {
  const [flow, setFlow] = useState<Flow>()
  const { apiKey, config } = useContext(FrigadeContext)
  const filteredConfig = Object.fromEntries(
    Object.entries(config).filter(([k, v]) => ['apiUrl', 'userId'].includes(k) && v != null)
  )

  const frigadeRef = useRef(new Frigade(apiKey, filteredConfig))
  const frigade = frigadeRef.current

  const handler = (updatedFlow: Flow) => {
    if (updatedFlow.id !== flowId) {
      return
    }

    const clonedFlow = Object.assign(Object.create(Object.getPrototypeOf(updatedFlow)), updatedFlow)

    setFlow(clonedFlow)
  }

  useEffect(() => {
    ;(async () => {
      const flowResponse: Flow = await frigade.getFlow(flowId)

      setFlow(flowResponse)
    })()

    frigade.onFlowStateChange(handler)

    return () => {
      frigade.removeOnFlowStateChangeHandler(handler)
    }
  }, [])

  return { flow }
}
