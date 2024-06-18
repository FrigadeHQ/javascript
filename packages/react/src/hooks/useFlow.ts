import { type Flow } from '@frigade/js'
import { useCallback, useContext, useEffect, useState } from 'react'

import { FrigadeContext } from '@/components/Provider'

export interface FlowConfig {
  variables?: Record<string, unknown>
}

export function useFlow(flowId: string | null, config?: FlowConfig): { flow?: Flow } {
  const [flow, setFlow] = useState<Flow>()
  const [, setRandomString] = useState<string>('')
  const { frigade } = useContext(FrigadeContext)

  const handler = useCallback(
    (updatedFlow: Flow) => {
      if (updatedFlow.id !== flowId) {
        return
      }

      if (config?.variables) {
        updatedFlow.applyVariables(config.variables)
      }

      /*
        @frigade/js can call this handler at any time, so let's bump our state setters
        out of the current call stack to avoid a potential "Cannot update a component
        while rendering a different component" warning.
      */
      setTimeout(() => {
        setFlow(updatedFlow)
        setRandomString(Math.random().toString())
      }, 0)
    },
    [config?.variables, flowId, frigade]
  )

  useEffect(() => {
    if (!frigade?.isReady() || flowId == null) {
      return
    }

    ;(async () => {
      const flowInstance: Flow = await frigade.getFlow(flowId)
      if (!flowInstance || frigade.hasFailedToLoad()) {
        setFlow(undefined)
        return
      }
      if (config?.variables) {
        flowInstance.applyVariables(config.variables)
      }

      setFlow(flowInstance)
    })()

    frigade.onStateChange(handler)

    return () => {
      frigade.removeStateChangeHandler(handler)
    }
  }, [flowId, frigade, handler])

  useEffect(() => {
    if (!config?.variables || !flow) {
      return
    }

    handler(flow)
  }, [config?.variables])

  return { flow }
}
