import { Collection } from '@/components/Collection'
import { useCollections } from '@/hooks/useCollections'

export function DefaultCollection() {
  const { collections } = useCollections()

  const collectionId = Array.from(collections?.entries() ?? []).find(
    (entry) => entry[1].collectionType === 'DEFAULT'
  )?.[0]

  if (collectionId == null) {
    return null
  }

  return <Collection as={null} collectionId={collectionId} />
}
