import { Flow } from '@frigade/js'
import { useContext, useEffect, useState } from 'react'

import { FrigadeContext } from '../components/Provider'

export interface FlowConfig {
  variables?: Record<string, any>
}

export function useFlow(flowId: string, config?: FlowConfig) {
  const [flow, setFlow] = useState<Flow>()
  const [_, setRandomString] = useState<string>('')
  const { frigade } = useContext(FrigadeContext)

  const handler = (updatedFlow: Flow) => {
    if (updatedFlow.id !== flowId) {
      return
    }

    if (config?.variables) {
      updatedFlow.applyVariables(config.variables)
    }

    setFlow(updatedFlow)
    setRandomString(Math.random().toString())
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
