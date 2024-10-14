import { createContext, type Dispatch, type SetStateAction } from 'react'

import { type SerializedTree } from '@/components/Editor/serializer'

export interface EditorContextType {
  activeId: string | null
  moveBetweenContainers: ({ active, over }: { active: unknown; over: unknown }) => void
  moveWithinContainer: ({ active, over }: { active: unknown; over: unknown }) => void
  nonce: number
  selectedId: string | null
  serializedTree: SerializedTree
  setActiveId: Dispatch<SetStateAction<string>>
  setSelectedId: Dispatch<SetStateAction<string>>
  setSerializedTree: Dispatch<SetStateAction<SerializedTree>>
}

export const EditorContext = createContext<EditorContextType>({
  activeId: null,
  moveBetweenContainers: () => {},
  moveWithinContainer: () => {},
  nonce: 0,
  selectedId: null,
  serializedTree: { elements: {}, root: '' },
  setActiveId: () => {},
  setSelectedId: () => {},
  setSerializedTree: () => {},
})
