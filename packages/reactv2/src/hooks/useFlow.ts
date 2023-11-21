import { Flow, Frigade } from '@frigade/js'
import { useContext, useEffect, useState } from 'react'

import { FrigadeContext } from '../components/Provider'

export function useFlow(flowId: string) {
  const [flow, setFlow] = useState<Flow>(null)
  const { apiKey, config } = useContext(FrigadeContext)
  const filteredConfig = Object.fromEntries(
    Object.entries(config).filter(([k, v]) => ['apiUrl', 'userId'].includes(k) && v != null)
  )
  const frigade = new Frigade(apiKey, filteredConfig)

  useEffect(() => {
    const handler = (flow: Flow) => {
      setFlow(flow)
    }

    frigade.onFlowStateChange(handler)
    return () => {
      frigade.removeOnFlowStateChangeHandler(handler)
    }
  }, [])

  async function fetchFlow() {
    const flowResponse: Flow = await frigade.getFlow(flowId)
    setFlow(flowResponse)
  }

  if (flow === null) {
    fetchFlow()
  }

  return { flow, fetchFlow }
}
