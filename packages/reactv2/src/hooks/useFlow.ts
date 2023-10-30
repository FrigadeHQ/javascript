import { Frigade } from '@frigade/js'
import { useContext, useState } from 'react'

import { FrigadeContext } from '../components/Provider'

export function useFlow(flowId: string) {
  const [flow, setFlow] = useState(null)
  const { apiKey, config } = useContext(FrigadeContext)

  // ;(async () => {
  //   if (flow == null) {
  //     const frigade = await new Frigade(apiKey, {
  //       apiUrl: config.apiUrl,
  //       userId: config.userId,
  //     })

  //     const flowResponse = await frigade.getFlow(flowId)

  //     setFlow(flowResponse)
  //   }
  // })()

  async function fetchFlow() {
    const frigade = await new Frigade(apiKey, {
      apiUrl: config.apiUrl,
      userId: config.userId,
    })

    const flowResponse = await frigade.getFlow(flowId)

    setFlow(flowResponse)
  }

  if (flow === null) {
    fetchFlow()
  }

  // TEMP: Expose a way to manually refresh the flow.
  // TODO: Automatically update state when something like step.complete() is called
  return { flow, fetchFlow }
}
