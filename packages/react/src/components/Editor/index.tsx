import {
  DndContext,
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

function DroppableCard(props) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable-card',
  })

  const style = {
    backgroundColor: isOver ? 'var(--fr-colors-neutral-900)' : undefined,
  }

  return <Card ref={setNodeRef} style={style} {...props} />
}
DroppableCard.displayName = 'DroppableCard'

function SortableCard({ children, ...props }) {
  const [items, setItems] = useState(['sortable-title', 'sortable-subtitle'])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event) {
    const { active, over } = event

    console.log('DRAG END: ', active, over)

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id)
        const newIndex = items.indexOf(over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  console.log('SORTABLE CARD ITEMS: ', items)

  const sortedChildren = Children.toArray(children).sort(
    (a, b) => items.indexOf(a.props.id) - items.indexOf(b.props.id)
  )

  console.log('SORTABLE CHILDREN: ', sortedChildren)

  return (
    <Card {...props}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {sortedChildren}
        </SortableContext>
      </DndContext>
    </Card>
  )
}
SortableCard.displayName = 'SortableCard'

function SortableSubtitle({ id, ...props }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return <Card.Subtitle ref={setNodeRef} style={style} {...listeners} {...attributes} {...props} />
}
SortableSubtitle.displayName = 'SortableSubtitle'

function SortableTitle({ id, ...props }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return <Card.Title ref={setNodeRef} style={style} {...listeners} {...attributes} {...props} />
}
SortableTitle.displayName = 'SortableTitle'

// ---

function DraggableTitle(props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable-title',
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return <Card.Title ref={setNodeRef} style={style} {...listeners} {...attributes} {...props} />
}
DraggableTitle.displayName = 'DraggableTitle'

function DraggableSubtitle(props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable-subtitle',
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return <Card.Subtitle ref={setNodeRef} style={style} {...listeners} {...attributes} {...props} />
}
DraggableSubtitle.displayName = 'DraggableSubtitle'

const componentMap = {
  DraggableSubtitle,
  DraggableTitle,
  DroppableCard,
  Card,
  SortableCard,
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
  return (
    <SortableCard borderWidth="md" display="block">
      <SortableTitle id="sortable-title">This is the title of the card</SortableTitle>
      <SortableSubtitle id="sortable-subtitle">
        This is the subtitle, it's considerably longer than the title.
      </SortableSubtitle>
    </SortableCard>
  )

  const sTest = JSON.parse(serialize(test))

  console.log(sTest)

  const dTest = deserialize(sTest)

  // console.log(dTest)

  return test
}
