import { Frigade } from '@frigade/js'
import { useContext, useState } from 'react'

import { FrigadeContext } from '../components/Provider'

export function useFlow(flowId: string) {
  const [flow, setFlow] = useState(null)
  const { apiKey, config } = useContext(FrigadeContext)

  ;(async () => {
    if (flow == null) {
      const frigade = await new Frigade(apiKey, {
        apiUrl: config.apiUrl,
      })

      const flowResponse = await frigade.getFlow(flowId)

      setFlow(flowResponse)
    }
  })()

  return flow
}
