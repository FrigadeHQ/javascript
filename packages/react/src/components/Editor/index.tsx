import {
  DndContext,
  DragOverlay,
  closestCenter,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import React, { useState } from 'react'

import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'
import { Text } from '@/components/Text'

import { flatSerialize, flatDeserialize, hydrateElement } from '@/components/Editor/serializer'

export function Editor() {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
    // useSensor(KeyboardSensor, {
    //   coordinateGetter: sortableKeyboardCoordinates,
    // })
  )

  const [activeId, setActiveId] = useState(null)

  const init = (
    <Card borderWidth="md">
      <Card.Title>Title</Card.Title>
      <Card.Subtitle>Subtitle</Card.Subtitle>
    </Card>
  )

  const bullpenInit = (
    <Card backgroundColor="neutral.800" id="bullpen">
      <Card.Title id="new-title">New title</Card.Title>
    </Card>
  )

  const serializedInit = flatSerialize(init)
  const serializedBullpen = flatSerialize(bullpenInit)

  for (const [itemId, item] of Object.entries(serializedBullpen.elements)) {
    serializedInit.elements[itemId] = item
  }

  serializedBullpen.elements = serializedInit.elements

  const [serializedTree, setSerializedTree] = useState(serializedInit)

  // console.log(serializedTree)

  const deserializedTree = flatDeserialize(serializedTree)

  function moveBetweenContainers({ active, activeContainer, over, overContainer }) {
    const newOverContainer = { ...overContainer }

    const overItems = newOverContainer.children
    const overIndex = overItems.indexOf(over.id)

    console.log('OVER INDEX: ', overIndex)

    if (overIndex === -1) {
      newOverContainer.children.push(active.id)
    } else {
      newOverContainer.children.splice(overIndex, 0, active.id)
    }

    setSerializedTree((tree) => {
      const newTree = {
        ...tree,
        elements: {
          ...tree.elements,
          [overContainer.props.id]: newOverContainer,
        },
      }

      if (activeContainer != null) {
        const newActiveContainer = { ...activeContainer }
        const activeItems = newActiveContainer.children
        const activeIndex = activeItems.indexOf(active.id)

        newActiveContainer.children.splice(activeIndex, 1)

        newTree.elements[activeContainer.props.id] = newActiveContainer
      }

      console.log('MOVE BETWEEN: ', newTree)

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

    setSerializedTree((tree) => {
      const newTree = {
        ...tree,
        elements: {
          ...tree.elements,
          [overContainerId]: newOverContainer,
        },
      }

      console.log('MOVE WITHIN: ', newTree)

      return newTree
    })
  }

  function handleDragOver({ active, over }) {
    if (!over) {
      return
    }

    const activeContainerId = active.data.current?.sortable?.containerId
    const activeContainer = serializedTree.elements[activeContainerId]
    const overContainerId = over.data.current?.sortable?.containerId ?? over.id
    const overContainer = serializedTree.elements[overContainerId]

    if (overContainerId) {
      console.log('OVER: ', activeContainerId, overContainerId)

      if (activeContainerId != overContainerId) {
        moveBetweenContainers({ active, activeContainer, over, overContainer })
      } else {
        moveWithinContainer({ active, over })
      }
    }
  }

  function handleDragEnd({ active, over }) {
    if (!over) {
      return
    }

    const activeContainerId = active.data.current?.sortable?.containerId
    const activeContainer = serializedTree.elements[activeContainerId]
    const overContainerId = over.data.current?.sortable?.containerId ?? over.id
    const overContainer = serializedTree.elements[overContainerId]

    if (overContainerId) {
      console.log('OVER: ', activeContainerId, overContainerId)

      if (activeContainerId != overContainerId) {
        moveBetweenContainers({ active, activeContainer, over, overContainer })
      } else {
        moveWithinContainer({ active, over })
      }
    }

    console.log('DRAG END: ', serializedTree)

    setActiveId(null)
  }

  function handleDragStart({ active }) {
    setActiveId(active.id)
  }

  function getDragOverlay(elementId) {
    if (serializedTree.elements[elementId] != null) {
      return hydrateElement(elementId, serializedTree.elements)
    }

    return null
  }

  // console.log('#### D TREE: ', deserializedTree)
  // console.log('DC: ', bullpen, deserializedBullpen)

  return (
    <DndContext
      sensors={sensors}
      // collisionDetection={closestCenter}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
    >
      <Flex.Row gap="4">
        <div style={{ width: '30%' }}>{hydrateElement('bullpen', serializedTree.elements)}</div>
        <div style={{ width: '70%' }}>{deserializedTree}</div>
      </Flex.Row>

      {/* <Text.H2 mb="2">Available components:</Text.H2>
      {hydrateElement('bullpen', serializedTree.elements)}

      <Text.H2 mb="2" mt="5">
        Template:
      </Text.H2>
      {deserializedTree} */}

      <Text.H4 mb="2" mt="5">
        Serialized template:
      </Text.H4>
      <pre style={{ width: '100%' }}>{JSON.stringify(serializedTree, null, 2)}</pre>

      <DragOverlay>{getDragOverlay(activeId)}</DragOverlay>
    </DndContext>
  )
}
