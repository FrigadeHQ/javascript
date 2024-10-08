import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import React, { useState } from 'react'

import { Card } from '@/components/Card'

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

    const overItems = newOverContainer.props.items
    const overIndex = overItems.indexOf(over.id)

    console.log('OVER INDEX: ', overIndex)

    if (overIndex === -1) {
      newOverContainer.children.push(active.id)
      newOverContainer.props.items.push(active.id)
    } else {
      newOverContainer.children.splice(overIndex, 0, active.id)
      newOverContainer.props.items.splice(overIndex, 0, active.id)
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
        const activeItems = newActiveContainer.props.items
        const activeIndex = activeItems.indexOf(active.id)

        newActiveContainer.children.splice(activeIndex, 1)
        newActiveContainer.props.items.splice(activeIndex, 1)

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

    const overItems = newOverContainer.props.items
    const activeIndex = overItems.indexOf(active.id)
    const overIndex = overItems.indexOf(over.id)

    newOverContainer.props.items = arrayMove(overItems, activeIndex, overIndex)

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
    // console.log('DRAG END: ', active, over)

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

  function handleDragOver_old({ active, over }) {
    // If active is over the droppable card
    // Insert it into the items of that card in the current position

    if (!over.id) {
      return
    }

    console.log('DRAG: ', active.id, over.id)

    const activeContainerId = active.data.current?.sortable?.containerId
    const activeContainer = serializedTree.elements[activeContainerId]
    const overContainerId = over.data.current?.sortable?.containerId
    const overContainer =
      serializedTree.elements[overContainerId] ?? serializedTree.elements[over.id]

    /*

      if not over self
        if in same container
          reorder container.props.items
        

      ------

      if over self or over own container or over non-empty container
        return

      if not over active's container
        if over a container
          splice into over's container at over's index
        else
          push onto over's children
        remove from active's container
      else
        move within container
    */

    if (active.id === over.id) {
      return
    }

    const dropTargetId = overContainerId ?? over.id

    const newDropTarget = { ...serializedTree.elements[dropTargetId] }
    const items = overContainer.props.items
    const oldIndex = items.indexOf(active.id)
    const newIndex = items.indexOf(over.id)

    if (dropTargetId !== activeContainerId && activeContainerId != null) {
      if (overContainerId) {
        newDropTarget.props.items.splice(newIndex, 0, active.id)
        newDropTarget.children.splice(newIndex, 0, active.id)
      } else {
        newDropTarget.children.push(active.id)
      }

      // remove from activeContainer
    } else {
      newDropTarget.props.items = arrayMove(items, oldIndex, newIndex)
    }

    let newActiveContainer

    if (activeContainer != null) {
      newActiveContainer = { ...activeContainer }

      newActiveContainer.props.items = newActiveContainer.props.items.filter(
        (id) => id !== active.id
      )
      newActiveContainer.children = newActiveContainer.children.filter((id) => id !== active.id)
    }

    setSerializedTree((tree) => {
      const newTree = {
        ...tree,
        elements: {
          ...tree.elements,
          [dropTargetId]: newDropTarget,
        },
      }

      if (newActiveContainer != null) {
        newTree.elements[activeContainerId] = newActiveContainer
      }

      return newTree
    })

    // set state

    // TEMP: SKIPPING EVERYTHING BELOW THIS LINE
    return

    if (active.id !== over.id) {
      const overContainerId = over.data.current?.sortable.containerId
      const overContainer = serializedTree.elements[overContainerId]

      const activeContainerId = active.data.current?.sortable.containerId
      const activeContainer = serializedTree.elements[activeContainerId]

      // console.log('#### OVER ID: ', overContainerId, overContainer, serializedTree)

      /*
        If we're over an element that has a container
          If active isn't already in the container
            Get the index we're over
            and splice active into the current container at that point
        Else we're over a container or some other droppable object
          TODO: Figure out what to do in this case
      */

      // Dropping onto a child of a container
      if (overContainer != null) {
        const items = overContainer.props.items
        const oldIndex = items.indexOf(active.id)
        const newIndex = items.indexOf(over.id)

        const newContainer = { ...overContainer }

        let newActiveContainer

        if (oldIndex === -1) {
          newContainer.props.items.splice(newIndex, 0, active.id)
          newContainer.children.splice(newIndex, 0, active.id)

          console.log('NOT IN CONTAINER: ', active.id, items, oldIndex, newContainer)

          if (activeContainer != null) {
            newActiveContainer = { ...activeContainer }

            newActiveContainer.props.items = newActiveContainer.props.items.filter(
              (id) => id !== active.id
            )
            newActiveContainer.children = newActiveContainer.children.filter(
              (id) => id !== active.id
            )

            console.log('ACTIVE CONTAINER: ', newActiveContainer)
          } else {
            console.log('NO ACTIVE CONTAINER: ', active)
          }
        } else {
          newContainer.props.items = arrayMove(items, oldIndex, newIndex)
        }

        setSerializedTree((tree) => {
          const newTree = {
            ...tree,
            elements: {
              ...tree.elements,
              [overContainerId]: newContainer,
            },
          }

          if (newActiveContainer != null) {
            newTree.elements[activeContainerId] = newActiveContainer
          }

          return newTree
        })

        // Dropping onto an empty container
      } else {
        if (over.id == null) {
          return
        }

        const dropTarget = serializedTree.elements[over.id]

        if (dropTarget.children.includes(active.id)) {
          console.log('OVER SAME CONTAINER')
          return
        }

        const activeContainerId = active.data.current?.sortable.containerId
        const activeContainer = serializedTree.elements[overContainerId]

        const newTarget = { ...dropTarget }

        newTarget.children.push(active.id)
        newTarget.props.items.push(active.id)

        let newActiveContainer

        if (activeContainer != null && activeContainerId !== over.id) {
          newActiveContainer = { ...activeContainer }

          newActiveContainer.props.items = newActiveContainer.props.items.filter(
            (id) => id !== active.id
          )
          newActiveContainer.children = newActiveContainer.children.filter((id) => id !== active.id)

          console.log('ACTIVE CONTAINER: ', newActiveContainer)
        } else {
          console.log('NO ACTIVE CONTAINER: ', active, over)
        }

        console.log('NO OVER CONTAINER: ', over.id, dropTarget, activeContainer)

        setSerializedTree((tree) => {
          const newTree = {
            ...tree,
            elements: {
              ...tree.elements,
              [over.id]: newTarget,
            },
          }

          if (newActiveContainer != null) {
            newTree.elements[activeContainerId] = newActiveContainer
          }

          return newTree
        })
      }
    }
  }

  // TODO: Handle case where item is dragged into new container, then dragged out to nowhere before drag end
  // Should probably check if we're over nothing and revert to original state?

  function handleDragStart({ active }) {
    // console.log('DRAG START: ', active)
    // if (bullpen.elements[active.id] != null) {
    setActiveId(active.id)
    // }
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
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
    >
      {deserializedTree}
      {hydrateElement('bullpen', serializedTree.elements)}

      <DragOverlay>{getDragOverlay(activeId)}</DragOverlay>
    </DndContext>
  )
}
