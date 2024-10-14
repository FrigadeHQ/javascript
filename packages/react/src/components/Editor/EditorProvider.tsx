import { useState } from 'react'

import { EditorContext } from '@/components/Editor/EditorContext'
import { useSerializedTree } from '@/components/Editor/useSerializedTree'

export function EditorProvider({ children, initialSerializedTree }) {
  const { moveBetweenContainers, moveWithinContainer, nonce, serializedTree, setSerializedTree } =
    useSerializedTree(initialSerializedTree)

  const [activeId, setActiveId] = useState(null)
  const [selectedId, setSelectedId] = useState(null)

  return (
    <EditorContext.Provider
      value={{
        activeId,
        moveBetweenContainers,
        moveWithinContainer,
        nonce,
        selectedId,
        serializedTree,
        setActiveId,
        setSelectedId,
        setSerializedTree,
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}
