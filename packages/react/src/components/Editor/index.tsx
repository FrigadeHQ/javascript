import {
  DndContext,
  DragOverlay,
  closestCenter,
  closestCorners,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'

import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'
import { Text } from '@/components/Text'

import { useFlow } from '@/hooks/useFlow'

import {
  flatSerialize,
  flatDeserialize,
  hydrateElement,
  type SerializedTree,
} from '@/components/Editor/serializer'

function collision(args) {
  // First, let's see if there are any collisions with the pointer
  const pointerCollisions = pointerWithin(args)

  // Collision detection algorithms return an array of collisions
  if (pointerCollisions.length > 0) {
    return pointerCollisions
  }

  const cornerCollisions = closestCorners(args)

  if (cornerCollisions.length > 0) {
    return cornerCollisions
  }

  // If there are no collisions with the pointer, return rectangle intersections
  return rectIntersection(args)
}

export function Editor() {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  )

  const [activeId, setActiveId] = useState(null)

  const { flow } = useFlow('flow_xw9xq7yc')

  const step = flow?.getCurrentStep()

  // console.log(step)

  useEffect(() => {
    if (step != null) {
      setSerializedTree(getSerializedInit())
    }
  }, [step])

  function getSerializedInit() {
    const init = (
      <Card borderWidth="md">
        <Card.Title>{step?.title}</Card.Title>
        <Card.Subtitle>{step?.subtitle}</Card.Subtitle>
        <Flex.Row>
          <Button.Primary title={step?.primaryButton.title} />
          <Button.Secondary title="Secondary Button" />
        </Flex.Row>
      </Card>
    )

    const bullpenInit = (
      <Card backgroundColor="neutral.800" id="bullpen">
        <Card.Title id="new-title">New title</Card.Title>
      </Card>
    )

    const serializedInit = flatSerialize(init) as SerializedTree
    const serializedBullpen = flatSerialize(bullpenInit) as SerializedTree

    for (const [itemId, item] of Object.entries(serializedBullpen.elements)) {
      serializedInit.elements[itemId] = item
    }

    serializedBullpen.elements = serializedInit.elements

    return serializedInit
  }

  const [serializedTree, setSerializedTree] = useState(getSerializedInit())

  // console.log(serializedTree)

  const deserializedTree = flatDeserialize(serializedTree)

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

    setSerializedTree((tree) => {
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

    setSerializedTree((tree) => {
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

  function handleDragOver({ active, over }) {
    if (!over) {
      return
    }

    // console.log('OVER: ', over, active, over.id === active.id)
    // return

    const activeContainerId = active.data.current?.sortable?.containerId
    const overContainerId = over.data.current?.sortable?.containerId ?? over.id

    if (overContainerId) {
      if (activeContainerId != overContainerId) {
        moveBetweenContainers({ active, over })
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
    const overContainerId = over.data.current?.sortable?.containerId ?? over.id

    if (overContainerId) {
      if (activeContainerId != overContainerId) {
        moveBetweenContainers({ active, over })
      } else {
        moveWithinContainer({ active, over })
      }
    }

    // console.log('DRAG END: ', serializedTree)

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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collision}
      //collisionDetection={closestCenter}
      //collisionDetection={closestCorners}
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
