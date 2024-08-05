import { type Flow } from '@frigade/js'
import { useCallback, useContext, useState, useSyncExternalStore } from 'react'

import { FrigadeContext } from '@/components/Provider'

export interface FlowConfig {
  variables?: Record<string, unknown>
}

export function useFlow(flowId: string | null, config?: FlowConfig) {
  const { frigade } = useContext(FrigadeContext)
  const [, setForceRender] = useState<boolean>(false)

  const subscribe = useCallback(
    (cb: () => void) => {
      // TODO: Why is there a noticeable delay when this is commented out?
      frigade.getFlow(flowId).then(() => {
        cb()
      })

      const handler = (updatedFlow: Flow) => {
        if (updatedFlow.id !== flowId) {
          return
        }

        setForceRender((forceRender) => !forceRender)

        cb()
      }

      frigade.onStateChange(handler)

      return () => {
        frigade.removeStateChangeHandler(handler)
      }
    },
    [flowId]
  )

  const flow = useSyncExternalStore(subscribe, () => frigade.getFlowSync(flowId))

  if (flow != null && config?.variables) {
    flow.applyVariables(config.variables)
  }

  return {
    flow,
  }
}
