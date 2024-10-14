import { DndContext, useSensor, useSensors, PointerSensor, rectIntersection } from '@dnd-kit/core'

import { useEditorContext } from '@/components/Editor/useEditorContext'

function collision(args) {
  // First, let's see if there are any collisions with the pointer
  // const pointerCollisions = pointerWithin(args)

  // Collision detection algorithms return an array of collisions
  // if (pointerCollisions.length > 0) {
  //   return pointerCollisions
  // }

  // const cornerCollisions = closestCorners(args)

  // if (cornerCollisions.length > 0) {
  //   return cornerCollisions
  // }

  // If there are no collisions with the pointer, return rectangle intersections
  return rectIntersection(args)
}

export function DndContextWrapper({ children }) {
  const { moveBetweenContainers, moveWithinContainer, setActiveId, setSelectedId } =
    useEditorContext()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  )

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
    setSelectedId(active.id)
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
      {children}
    </DndContext>
  )
}
