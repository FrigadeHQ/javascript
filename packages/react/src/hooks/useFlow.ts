import { FlowChangeEvent, type Flow } from '@frigade/js'
import { useCallback, useContext, useEffect, useState } from 'react'

import { FrigadeContext } from '@/components/Provider'
import { useSyncExternalStore } from '@/hooks/useSyncExternalStore'
import { logOnce } from '@/shared/log'

export interface FlowConfig {
  variables?: Record<string, unknown>
}

export function useFlow(
  flowId: string | null,
  config?: FlowConfig
): {
  flow: Flow | undefined
  isLoading: boolean
} {
  const context = useContext(FrigadeContext)
  if (!context || !context.frigade) {
    logOnce(`useFlow('${flowId}') must be used in a child of the Frigade Provider`, 'warn')
  }
  const { frigade, variables } = context ?? {}
  const [, setForceRender] = useState<boolean>(false)

  const subscribe = useCallback(
    (cb: () => void) => {
      // TODO: Why is there a noticeable delay when this is commented out?
      frigade?.getFlow(flowId).then(() => {
        cb()
      })

      const handler = (_event: FlowChangeEvent, updatedFlow: Flow) => {
        if (updatedFlow.id !== flowId) {
          return
        }

        /*
         * NOTE: Since React doesn't re-render on deep object diffs,
         * we need to gently prod it here by creating a state update.
         */
        setTimeout(() => {
          setForceRender((forceRender) => !forceRender)

          cb()
        }, 0)
      }

      frigade?.on('flow.any', handler)

      return () => {
        frigade?.off('flow.any', handler)
      }
    },
    [flowId, frigade]
  )

  const flow = useSyncExternalStore<Flow | undefined>(
    subscribe,
    () => frigade?.getFlowSync(flowId),
    () => frigade?.getFlowSync(flowId)
  )

  useEffect(() => {
    flow?.applyVariables({
      ...variables,
      ...config?.variables,
    })
  }, [config?.variables, flow, flowId, variables])

  // When guest IDs are disabled and no userId has been provided yet, no Flow
  // will ever load: resolve immediately instead of staying in a loading state.
  const willNeverLoad = frigade?.hasFailedToLoad() || frigade?.isAnonymousWithGuestIdDisabled()

  return {
    flow,
    isLoading: willNeverLoad ? false : !flow,
  }
}
