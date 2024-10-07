import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import React, { Children, useState } from 'react'

import { Card } from '@/components/Card'

import { SortableCard, SortableSubtitle, SortableTitle } from './SortableCard'

// function resolvePath(object, path, defaultValue = null) {
//   return path.split('.').reduce((o, p) => (o ? o[p] : defaultValue), object)
// }

/*
{
  elementId: {
    type: 'string',
    props: {
      ...  
    },
    children: [
      'elementId',
      ....
    ]
  },
  ...
}
*/

function flatSerialize(element, acc = {}, parent = null) {
  if (typeof element === 'string') {
    return element
  }

  const key = element.key ?? element.props.id ?? crypto.randomUUID()

  if (parent != null) {
    parent.children.push(key)
    parent.props.items.push(key)
  }

  const { children, ...props } = element.props ?? {}

  if (!props.id) {
    props.id = key
  }

  acc[key] = {
    type: typeof element.type === 'string' ? element.type : element.type.displayName,
    props,
  }

  if (Array.isArray(children)) {
    acc[key].children = []
    acc[key].props.items = []

    for (const child of children) {
      flatSerialize(child, acc, acc[key])
    }
  } else if (typeof children === 'string') {
    acc[key].children = children
  } else if (children?.type?.displayName != null) {
    acc[key].children = []
    acc[key].props.items = []

    flatSerialize(children, acc, acc[key])
  }

  return {
    elements: acc,
    root: key,
  }
}

function flatDeserialize(serialized) {
  const parsed = typeof serialized === 'string' ? JSON.parse(serialized) : serialized

  return hydrateElement(parsed.root, parsed.elements)
}

function hydrateElement(elementId, elements) {
  const element = elements[elementId]

  // console.log('#### HYDRATE: ', elementId, element, elements)

  const props = {
    ...(element.props ?? {}),
    key: elementId,
  }

  // TODO MONDAY: WAIT I THINK PROPS ISN'T BEING RESET? OR SOMETHING IS FUCKED HERE?
  if (Array.isArray(element.children)) {
    props.children = element.children.map((childId) => hydrateElement(childId, elements))
    props.items = props.items ?? element.children
  } else {
    props.children = element.children
  }

  return React.createElement(componentMap[element.type], props)
}

function serializeElement(element) {
  const replacer = (key, value) => {
    switch (key) {
      case 'type':
        return typeof value === 'string' ? value : value.displayName
      case '_owner':
      case '_store':
      case 'ref':
        // case 'key':
        return
      case 'key':
        return value != null ? value : crypto.randomUUID()
      default:
        return value
    }
  }

  return JSON.parse(JSON.stringify(element, replacer))
}

function deserializeElement(serializedElement) {
  return createElement(serializedElement)
}

function parsePropsWithChildren(props) {
  const newProps = { ...props }

  if (newProps.children == null || typeof newProps.children === 'string') {
    return newProps
  }

  if (Array.isArray(newProps.children)) {
    newProps.children = newProps.children.map((child, i) => {
      // TEMP: Patch a key in so React stops warning us
      if (child.props.key == null) {
        child.props.key = i
      }

      return createElement(child)
    })

    return newProps
  }

  newProps.children = createElement(newProps.children)

  return newProps
}

const componentMap = {
  Card: SortableCard,
  'Card.Title': SortableTitle,
  'Card.Subtitle': SortableSubtitle,
}

function createElement(el) {
  // TODO: Add key
  // return React.createElement(resolvePath(componentMap, el.type), parsePropsWithChildren(el.props))

  if (el.key) {
    el.props.id = el.key
    el.props.key = el.key
  }

  return React.createElement(componentMap[el.type], parsePropsWithChildren(el.props))
}

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
    <Card backgroundColor="neutral.800" id="new-card">
      <Card.Title id="new-title">New title</Card.Title>
    </Card>
  )

  const serializedInit = flatSerialize(init)
  const serializedBullpen = flatSerialize(bullpenInit)

  for (const [itemId, item] of Object.entries(serializedBullpen.elements)) {
    if (itemId === 'new-card') {
      continue
    }

    serializedInit.elements[itemId] = item
  }

  const [serializedTree, setSerializedTree] = useState(serializedInit)
  const [bullpen, setBullpen] = useState(serializedBullpen)

  // console.log(serializedTree)

  // TODO: HEY MICAH LOOK HERE: DOES flatDeserialize correctly order everything?

  /*
    MONDAY CATCH UP:
    - In "SETTING TREE", children and items appear correct
    - But in SORTABLE CARD ITEMS, the items are still in the old order
    - What is causing the rendered component to get the wrong info?
    - Is it something in the deserialize func?
  */

  const deserializedTree = flatDeserialize(serializedTree)
  const deserializedBullpen = flatDeserialize(bullpen)

  function handleDragEnd({ active, over }) {
    // console.log('DRAG END: ', active, over)

    if (!over) {
      setActiveId(null)
      return
    }

    if (active.id !== over.id && over.id != 'new-card') {
      // const items = [...serializedTree.props.items]
      const overContainer = over.data.current?.sortable.containerId || over.id
      const items = serializedTree.elements[overContainer].props.items

      const oldIndex = items.indexOf(active.id)
      const newIndex = items.indexOf(over.id)

      // if (oldIndex === -1) {

      // } else {

      // }

      // const newId = crypto.randomUUID()

      // const newProps = {
      //   children: [...serializedTree.props.children],
      //   items,
      // }

      // if (oldIndex === -1) {
      //   // TODO: Make this work with any element type, not just title
      //   newProps.children.splice(newIndex, 0, {
      //     type: 'Card.Title',
      //     key: newId,
      //     props: {
      //       children: 'New title',
      //       key: newId,
      //       id: newId,
      //     },
      //   })

      //   newProps.items.splice(newIndex, 0, newId)
      // } else {
      //   newProps.items = arrayMove(items, oldIndex, newIndex)
      // }

      // console.log('OLD INDEX: ', oldIndex, newIndex)
      // console.log('NEW PROPS: ', newProps)

      // setSerializedTree((tree) => ({
      //   ...tree,
      //   props: {
      //     ...tree.props,
      //     ...newProps,
      //   },
      // }))
    }

    setActiveId(null)
  }

  function handleDragOver({ active, over }) {
    // If active is over the droppable card
    // Insert it into the items of that card in the current position

    if (!over) {
      return
    }

    if (active.id !== over.id && over.id != 'new-card') {
      const overContainerId = over.data.current?.sortable.containerId // || over.id
      const overContainer = serializedTree.elements[overContainerId]

      // console.log('#### OVER ID: ', overContainerId, overContainer, serializedTree)

      /*
        If we're over an element that has a container
          If active isn't already in the container
            Get the index we're over
            and splice active into the current container at that point
        Else we're over a container or some other droppable object
          TODO: Figure out what to do in this case
      */
      if (overContainer == null) {
        return
      }

      // TODO: Handle case where there are no existing children and there are no items yet

      const items = overContainer.props.items

      // const items = [...serializedTree.props.items]
      const oldIndex = items.indexOf(active.id)
      const newIndex = items.indexOf(over.id)

      const newContainer = { ...overContainer }

      if (oldIndex === -1) {
        newContainer.props.items.splice(newIndex, 0, active.id)
        newContainer.children.splice(newIndex, 0, active.id)

        console.log('NOT IN CONTAINER: ', active.id, items, oldIndex, newContainer)

        if (bullpen.elements[active.id] !== null) {
          const newBullpen = { ...bullpen }

          newBullpen.elements[newBullpen.root].props.items = newBullpen.elements[
            newBullpen.root
          ].props.items.filter((id) => id !== active.id)
          newBullpen.elements[newBullpen.root].children = newBullpen.elements[
            newBullpen.root
          ].children.filter((id) => id !== active.id)

          setBullpen(newBullpen)
        }
      } else {
        console.log('IN CONTAINER, REORDER: ', items, oldIndex, newIndex)
        newContainer.props.items = arrayMove(items, oldIndex, newIndex)

        console.log('REORDERED: ', newContainer)
      }

      setSerializedTree((tree) => {
        const newTree = {
          ...tree,
          elements: {
            ...tree.elements,
            [overContainerId]: newContainer,
          },
        }

        console.log('SETTING TREE: ', newTree)

        return newTree
      })

      // TODO: Use id of dragged item
      // const newId = 'new-title' // crypto.randomUUID()

      // const newProps = {
      //   children: [...overContainer.children],
      //   items,
      // }

      // if (oldIndex === -1) {
      //   // TODO: Make this work with any element type, not just title
      //   newProps.children.splice(newIndex, 0, {
      //     type: 'Card.Title',
      //     key: newId,
      //     props: {
      //       children: 'New title',
      //       key: newId,
      //       id: newId,
      //     },
      //   })

      //   newProps.items.splice(newIndex, 0, newId)
      // } else {
      //   newProps.items = arrayMove(items, oldIndex, newIndex)
      // }

      // console.log('OLD INDEX: ', oldIndex, newIndex)
      // console.log('NEW PROPS: ', newProps)

      // setSerializedTree((tree) => ({
      //   ...tree,
      //   props: {
      //     ...tree.props,
      //     ...newProps,
      //   },
      // }))
    }
  }

  // TODO: Handle case where item is dragged into new container, then dragged out to nowhere before drag end
  // Should probably check if we're over nothing and revert to original state?

  function handleDragStart({ active }) {
    console.log('DRAG START: ', active)
    // if (bullpen.elements[active.id] != null) {
    setActiveId(active.id)
    // }
  }

  function getDragOverlay(elementId) {
    if (serializedTree.elements[elementId] != null) {
      return hydrateElement(elementId, serializedTree.elements)
    } else if (serializedBullpen.elements[elementId] != null) {
      return hydrateElement(elementId, serializedBullpen.elements)
    }

    return null
  }

  console.log('#### D TREE: ', deserializedTree)
  // console.log('DC: ', bullpen, deserializedBullpen)

  return (
    <DndContext
      sensors={sensors}
      // collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
    >
      {deserializedTree}
      {deserializedBullpen}

      <DragOverlay>{getDragOverlay(activeId)}</DragOverlay>
    </DndContext>
  )
}
