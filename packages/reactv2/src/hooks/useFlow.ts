import { Frigade, Flow } from '@frigade/js'
import { useContext, useState } from 'react'

import { FrigadeContext } from '../components/Provider'

export function useFlow(flowId: string) {
  const [flow, setFlow] = useState<Flow>(null)
  const { apiKey, config } = useContext(FrigadeContext)

  async function fetchFlow() {
    const frigade = await new Frigade(apiKey, {
      apiUrl: config.apiUrl,
      userId: config.userId,
    })

    const flowResponse: Flow = await frigade.getFlow(flowId)

    setFlow(flowResponse)
  }

  if (flow === null) {
    fetchFlow()
  }

  // TEMP: Expose a way to manually refresh the flow.
  // TODO: Automatically update state when something like step.complete() is called
  return { flow, fetchFlow }
}
