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

  // const init = (
  //   <Card borderWidth="md">
  //     <Card.Title>Title</Card.Title>
  //     <Card.Subtitle>Subtitle</Card.Subtitle>
  //   </Card>
  // )

  // const serializedInit = serializeElement(init)

  const serializedInit = {
    type: 'Card',
    key: '916e76ab-d726-4648-80b0-83d0b025efad',
    props: {
      borderWidth: 'md',
      items: ['5acd05ea-73c5-48d5-b391-b618d783ec77', 'e896382d-c193-4c33-8e52-bac65eea42fa'],
      children: [
        {
          type: 'Card.Title',
          key: '5acd05ea-73c5-48d5-b391-b618d783ec77',
          props: {
            children: 'Title',
            key: '5acd05ea-73c5-48d5-b391-b618d783ec77',
            id: '5acd05ea-73c5-48d5-b391-b618d783ec77',
          },
        },
        {
          type: 'Card.Subtitle',
          key: 'e896382d-c193-4c33-8e52-bac65eea42fa',
          props: {
            children: 'Subtitle',
            key: 'e896382d-c193-4c33-8e52-bac65eea42fa',
            id: 'e896382d-c193-4c33-8e52-bac65eea42fa',
          },
        },
      ],
      id: '916e76ab-d726-4648-80b0-83d0b025efad',
      key: '916e76ab-d726-4648-80b0-83d0b025efad',
    },
  }

  const [serializedTree, setSerializedTree] = useState(serializedInit)

  console.log(serializedTree)

  const deserializedTree = deserializeElement(serializedTree)

  console.log(deserializedTree)

  function getContainer(containerId, context = serializedTree) {
    if (context.key === containerId) {
      return context
    }

    if (Array.isArray(context.props.children)) {
      for (const child of context.props.children) {
        const maybeContainer = getContainer(containerId, child)

        if (maybeContainer !== null) {
          return maybeContainer
        }
      }
    }

    return null
  }

  console.log('GET CONTAINER: ', getContainer('e896382d-c193-4c33-8e52-bac65eea42fa'))

  /*
  const containers = {
    containerId: [
      {
        'itemId': {
          props: {}
        }
      }
    ]
  }
  */

  // const containers = {
  //   '916e76ab-d726-4648-80b0-83d0b025efad': [
  //     {
  //       '5acd05ea-73c5-48d5-b391-b618d783ec77': {
  //         type: 'Card.Title',
  //         key: '5acd05ea-73c5-48d5-b391-b618d783ec77',
  //         props: {
  //           children: 'Title',
  //           key: '5acd05ea-73c5-48d5-b391-b618d783ec77',
  //           id: '5acd05ea-73c5-48d5-b391-b618d783ec77',
  //         },
  //       },
  //       'e896382d-c193-4c33-8e52-bac65eea42fa': {
  //         type: 'Card.Subtitle',
  //         key: 'e896382d-c193-4c33-8e52-bac65eea42fa',
  //         props: {
  //           children: 'Subtitle',
  //           key: 'e896382d-c193-4c33-8e52-bac65eea42fa',
  //           id: 'e896382d-c193-4c33-8e52-bac65eea42fa',
  //         },
  //       }
  //     }
  //   ]
  // }

  function handleDragEnd({ active, over }) {
    // console.log('DRAG END: ', active, over)

    if (!over) {
      setActiveId(null)
      return
    }

    if (active.id !== over.id && over.id != 'new-card') {
      const items = [...serializedTree.props.items]
      const oldIndex = items.indexOf(active.id)
      const newIndex = items.indexOf(over.id)

      const newId = crypto.randomUUID()

      const newProps = {
        children: [...serializedTree.props.children],
        items,
      }

      if (oldIndex === -1) {
        // TODO: Make this work with any element type, not just title
        newProps.children.splice(newIndex, 0, {
          type: 'Card.Title',
          key: newId,
          props: {
            children: 'New title',
            key: newId,
            id: newId,
          },
        })

        newProps.items.splice(newIndex, 0, newId)
      } else {
        newProps.items = arrayMove(items, oldIndex, newIndex)
      }

      console.log('OLD INDEX: ', oldIndex, newIndex)
      console.log('NEW PROPS: ', newProps)

      setSerializedTree((tree) => ({
        ...tree,
        props: {
          ...tree.props,
          ...newProps,
        },
      }))
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
      const items = [...serializedTree.props.items]
      const oldIndex = items.indexOf(active.id)
      const newIndex = items.indexOf(over.id)

      // TODO: Use id of dragged item
      const newId = 'new-title' // crypto.randomUUID()

      const newProps = {
        children: [...serializedTree.props.children],
        items,
      }

      if (oldIndex === -1) {
        // TODO: Make this work with any element type, not just title
        newProps.children.splice(newIndex, 0, {
          type: 'Card.Title',
          key: newId,
          props: {
            children: 'New title',
            key: newId,
            id: newId,
          },
        })

        newProps.items.splice(newIndex, 0, newId)
      } else {
        newProps.items = arrayMove(items, oldIndex, newIndex)
      }

      // console.log('OLD INDEX: ', oldIndex, newIndex)
      // console.log('NEW PROPS: ', newProps)

      setSerializedTree((tree) => ({
        ...tree,
        props: {
          ...tree.props,
          ...newProps,
        },
      }))
    }
  }

  // TODO: Handle case where item is dragged into new container, then dragged out to nowhere before drag end
  // Should probably check if we're over nothing and revert to original state?

  function handleDragStart({ active }) {
    console.log('DRAG START: ', active)
    if (availableItems[active.id] != null) {
      setActiveId(active.id)
    }
  }

  const availableItems = {
    'new-title': <SortableTitle id="new-title">New title</SortableTitle>,
    // 'new-subtitle': <SortableSubtitle id="new-subtitle">New subtitle</SortableSubtitle>,
  }

  const filteredAvailableItems = Array.from(Object.keys(availableItems)).filter(
    (item) => !serializedTree.props.items.includes(item)
  )

  return (
    <DndContext
      sensors={sensors}
      // collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
    >
      {deserializedTree}

      <SortableCard backgroundColor="neutral.800" id="new-card" items={filteredAvailableItems}>
        {!serializedTree.props.items.includes('new-title') && availableItems['new-title']}
        {/* {availableItems['new-subtitle']} */}
      </SortableCard>
      <DragOverlay>{activeId && availableItems[activeId]}</DragOverlay>
    </DndContext>
  )
}
