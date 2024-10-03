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
import { CSS } from '@dnd-kit/utilities'
import React, { Children, useState } from 'react'

import { Card } from '@/components/Card'

const componentMap = {
  Card,
}

function resolvePath(object, path, defaultValue = null) {
  return path.split('.').reduce((o, p) => (o ? o[p] : defaultValue), object)
}

function serialize(element) {
  const replacer = (key, value) => {
    switch (key) {
      case 'type':
        return typeof value === 'string' ? value : value.displayName
      case '_owner':
      case '_store':
      case 'ref':
        // case 'key':
        return
      default:
        return value
    }
  }

  return JSON.stringify(element, replacer)
}

function deserialize(string) {
  const parsed = JSON.parse(serialize(string))

  // console.log('WHAT: ', resolvePath(componentMap, parsed.type))

  return createElement(parsed)
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

function createElement(el) {
  // TODO: Add key
  return React.createElement(resolvePath(componentMap, el.type), parsePropsWithChildren(el.props))
}

export function Editor() {
  const init = (
    <Card borderWidth="md">
      <Card.Title>Title</Card.Title>
      <Card.Subtitle>Subtitle</Card.Subtitle>
    </Card>
  )

  const serializedInit = JSON.parse(serialize(init))

  const [serializedTree, setSerializedTree] = useState(serializedInit)

  console.log(serializedInit)

  const deserializedTree = deserialize(serializedTree)

  console.log(deserializedTree)

  return deserializedTree
}
