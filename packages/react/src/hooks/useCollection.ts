import { useContext, useEffect, useState } from 'react'
import type { Flow, Rule } from '@frigade/js'

import { FrigadeContext } from '@/components/Provider'

type EnrichedRule = Array<
  Rule[number] & {
    flow: Flow
  }
>

export function useCollection(collectionId: string) {
  const [collection, setCollection] = useState<EnrichedRule>()
  const { frigade } = useContext(FrigadeContext)

  useEffect(() => {
    ;(async () => {
      const apiCollection = await frigade.getCollection(collectionId)

      if (!apiCollection || frigade.hasFailedToLoad()) {
        setCollection(undefined)
        return
      }

      setCollection(apiCollection)
    })()
  }, [collectionId])

  return { collection }
}
