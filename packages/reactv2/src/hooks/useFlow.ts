import { Flow, Frigade } from '@frigade/js'
import { useContext, useEffect, useState } from 'react'

import { FrigadeContext } from '../components/Provider'

export function useFlow(flowId: string) {
  const [flow, setFlow] = useState<Flow>()
  const [_, setNonce] = useState(Math.random())
  const { apiKey, config } = useContext(FrigadeContext)
  const filteredConfig = Object.fromEntries(
    Object.entries(config).filter(([k, v]) => ['apiUrl', 'userId'].includes(k) && v != null)
  )
  const frigade = new Frigade(apiKey, filteredConfig)

  useEffect(() => {
    const handler = (updatedFlow: Flow) => {
      if (updatedFlow.id !== flowId) {
        return
      }

      setFlow(updatedFlow)
      setNonce(Math.random())
    }

    fetchFlow()
    frigade.onFlowStateChange(handler)
    return () => {
      frigade.removeOnFlowStateChangeHandler(handler)
    }
  }, [])

  async function fetchFlow() {
    const flowResponse: Flow = await frigade.getFlow(flowId)
    setFlow(flowResponse)
  }

  return { flow, fetchFlow }
}
