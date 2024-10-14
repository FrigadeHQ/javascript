import { type SetStateAction, useEffect } from 'react'

import { arrayMove } from '@dnd-kit/sortable'
import { useState } from 'react'

import type { SerializedTree } from '@/components/Editor/serializer'

export function useSerializedTree(initialTree = null) {
  const [serializedTree, setSerializedTree] = useState(initialTree)
  const [nonce, setNonce] = useState(0)

  function generateNonce() {
    return Math.random() * 10e16
  }

  useEffect(() => {
    setSerializedTree(initialTree)
    setNonce(generateNonce())
  }, [initialTree])

  function setSerializedTreeWithNonce(stateSetter: SetStateAction<SerializedTree>) {
    setSerializedTree(stateSetter)
    setNonce(generateNonce())

    // if (typeof stateSetter === 'function') {
    //   return setSerializedTree((tree) => {
    //     const treeCopy = {
    //       ...tree,
    //       nonce: generateNonce(),
    //     }

    //     console.log('SET TREE FUNC: ', treeCopy)

    //     return stateSetter(treeCopy)
    //   })
    // } else {
    //   return setSerializedTree((tree) => {
    //     const newTree = {
    //       ...tree,
    //       ...stateSetter,
    //       nonce: Math.random(),
    //     }

    //     console.log('SET TREE OBJ: ', newTree)

    //     return newTree
    //   })
    // }
  }

  function moveBetweenContainers({ active, over }) {
    const activeContainerId = active.data.current?.sortable?.containerId
    const activeContainer = serializedTree.elements[activeContainerId]
    const overContainerId = over.data.current?.sortable?.containerId ?? over.id
    const overContainer = serializedTree.elements[overContainerId]

    const newOverContainer = { ...overContainer }

    const overItems = newOverContainer.children
    const overIndex = overItems.indexOf(over.id)

    // Don't attempt to move an item into its own children
    // TODO: DFS to handle deeply nested cases, e.g. moving an item into its children's children
    if (active.id === overContainerId) {
      return
    }

    if (overIndex === -1) {
      newOverContainer.children.push(active.id)
    } else {
      newOverContainer.children.splice(overIndex, 0, active.id)
    }

    setSerializedTreeWithNonce((tree) => {
      const newTree = {
        ...tree,
        elements: {
          ...tree.elements,
          [overContainerId]: newOverContainer,
        },
      }

      if (activeContainer != null) {
        const newActiveContainer = { ...activeContainer }
        const activeItems = newActiveContainer.children
        const activeIndex = activeItems.indexOf(active.id)

        newActiveContainer.children.splice(activeIndex, 1)

        newTree.elements[activeContainerId] = newActiveContainer
      }

      // console.log('MOVE BETWEEN: ', newTree)

      return newTree
    })
  }

  function moveWithinContainer({ active, over }) {
    const overContainerId = over.data.current?.sortable?.containerId ?? over.id
    const overContainer = serializedTree.elements[overContainerId]

    const newOverContainer = { ...overContainer }

    const overItems = newOverContainer.children
    const activeIndex = overItems.indexOf(active.id)
    const overIndex = overItems.indexOf(over.id)

    newOverContainer.children = arrayMove(overItems, activeIndex, overIndex)

    setSerializedTreeWithNonce((tree) => {
      const newTree = {
        ...tree,
        elements: {
          ...tree.elements,
          [overContainerId]: newOverContainer,
        },
      }

      return newTree
    })
  }

  return {
    moveBetweenContainers,
    moveWithinContainer,
    nonce,
    serializedTree,
    setSerializedTree: setSerializedTreeWithNonce,
  }
}
