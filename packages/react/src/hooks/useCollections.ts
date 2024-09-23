import { useCallback, useContext, useState, useSyncExternalStore } from 'react'

import { FrigadeContext } from '@/components/Provider'

import { CollectionsList } from '@frigade/js'

export function useCollections() {
  const { frigade } = useContext(FrigadeContext)
  const [, setForceRender] = useState<boolean>(false)

  let debounceTimeout: ReturnType<typeof setTimeout>

  const subscribe = useCallback((cb: () => void) => {
    // TODO: Why is there a noticeable delay when this is commented out?
    frigade?.getCollections().then(() => {
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
      }, 0)
    }

    frigade?.onStateChange(handler)

    return () => {
      frigade?.removeStateChangeHandler(handler)
    }
  }, [])

  const getSnapshot = () => {
    let result = undefined

    try {
      result = frigade?.getCollectionsSync()
    } catch (noGlobalStateYet) {
      // no-op
    }

    return result
  }

  const collections = useSyncExternalStore<CollectionsList | undefined>(
    subscribe,
    getSnapshot,
    getSnapshot
  )

  return {
    collections,
  }
}
