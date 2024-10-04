import { useDroppable } from '@dnd-kit/core'
import { SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Children } from 'react'

import { Card } from '@/components/Card'

export function SortableCard({ children, id, items = [], ...props }) {
  console.log('SORTABLE CARD ITEMS: ', items)

  const { setNodeRef } = useDroppable({ id })

  const sortedChildren = Children.toArray(children).sort(
    (a, b) => items.indexOf(a.props.id) - items.indexOf(b.props.id)
  )

  console.log('SORTABLE CHILDREN: ', sortedChildren)

  return (
    <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
      <Card ref={setNodeRef} gap="0" {...props}>
        {sortedChildren}
      </Card>
    </SortableContext>
  )
}
SortableCard.displayName = 'Card'

export function SortableSubtitle({ id, ...props }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Card.Subtitle
      contentEditable={true}
      outline={0}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      {...props}
    />
  )
}
SortableSubtitle.displayName = 'Card.Subtitle'

export function SortableTitle({ id, ...props }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Card.Title
      contentEditable={true}
      outline={0}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      {...props}
    />
  )
}
SortableTitle.displayName = 'Card.Title'
