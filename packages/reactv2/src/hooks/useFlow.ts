import { Flow, Frigade } from '@frigade/js'
import { useContext, useEffect, useRef, useState } from 'react'

import { FrigadeContext } from '../components/Provider'

export interface FlowConfig {
  variables?: Record<string, any>
}

export function useFlow(flowId: string, config?: FlowConfig) {
  const [flow, setFlow] = useState<Flow>()
  const { apiKey, getConfig } = useContext(FrigadeContext)

  const frigadeRef = useRef(new Frigade(apiKey, getConfig()))
  const frigade = frigadeRef.current

  const handler = (updatedFlow: Flow) => {
    if (updatedFlow.id !== flowId) {
      return
    }

    if (config?.variables) {
      updatedFlow.applyVariables(config.variables)
    }

    const clonedFlow = Object.assign(Object.create(Object.getPrototypeOf(updatedFlow)), updatedFlow)

    setFlow(clonedFlow)
  }

  useEffect(() => {
    ;(async () => {
      const flowInstance: Flow = await frigade.getFlow(flowId)
      if (config?.variables) {
        flowInstance.applyVariables(config.variables)
      }

      setFlow(flowInstance)
    })()

    frigade.onStateChange(handler)

    return () => {
      frigade.removeStateChangeHandler(handler)
    }
  }, [])

  return { flow }
}
