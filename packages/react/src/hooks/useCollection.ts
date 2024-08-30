import { useCallback, useContext, useState, useSyncExternalStore } from 'react'

import { FrigadeContext } from '@/components/Provider'

import { useFlow } from '@/hooks/useFlow'

export function useCollection(collectionId: string) {
  const { frigade } = useContext(FrigadeContext)
  const [, setForceRender] = useState<boolean>(false)

  let debounceTimeout: ReturnType<typeof setTimeout>

  const subscribe = useCallback(
    (cb: () => void) => {
      // TODO: Why is there a noticeable delay when this is commented out?
      frigade?.getCollection(collectionId).then(() => {
        cb()
      })

      const handler = () => {
        clearTimeout(debounceTimeout)

        /*
         * NOTE: Since React doesn't re-render on deep object diffs,
         * we need to gently prod it here by creating a state update.
         */
        debounceTimeout = setTimeout(() => {
          setForceRender((forceRender) => !forceRender)

          cb()
        }, 100)
      }

      frigade?.onStateChange(handler)

      return () => {
        frigade?.removeStateChangeHandler(handler)
      }
    },
    [collectionId]
  )

  const collection = useSyncExternalStore(
    subscribe,
    () => {
      let result = undefined

      try {
        result = frigade?.getCollectionSync(collectionId)
      } catch (noGlobalStateYet) {
        // no-op
      }

      return result
    },
    () => {
      let result = undefined

      try {
        result = frigade?.getCollectionSync(collectionId)
      } catch (noGlobalStateYet) {
        // no-op
      }

      return result
    }
  )

  const enrichedFlows =
    collection?.flows?.map((item) => ({
      ...item,
      flow: frigade?.getFlowSync(item.flowId),
    })) ?? []

  const flowId = enrichedFlows.find(({ flow }) => flow.isVisible)?.flowId

  const { flow } = useFlow(flowId)

  return {
    collection,
    currentFlow: flow,
  }
}
