import { useEffect, useState } from 'react'

import { Collection } from '@/components/Collection'
import { useFrigade } from '@/hooks/useFrigade'

export function DefaultCollection() {
  const [collectionId, setCollectionId] = useState<string>()
  const { frigade } = useFrigade()

  useEffect(() => {
    frigade.getCollections().then((collections) => {
      collections?.forEach((c, id) => {
        if (c.collectionType === 'DEFAULT') {
          setCollectionId(id)
        }
      })
    })
  }, [])

  if (collectionId == null) {
    return null
  }

  return <Collection as={null} collectionId={collectionId} />
}
