import { useDroppable } from '@dnd-kit/core'
import {
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
  rectSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Children } from 'react'

import { Box } from '@/components/Box'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'

function SortableItem({ component, id, ...props }) {
  const Component = component ?? Box

  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  })

  const style = {
    cursor: isDragging ? 'grabbing' : 'grab',
    opacity: isDragging ? 0 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Component
      // contentEditable={true}
      // outline={0}
      data-sortable-id={id}
      ref={setNodeRef}
      style={style}
      userSelect="none"
      {...listeners}
      {...attributes}
      {...props}
    />
  )
}

export function SortableCard({ children, id, items = [], ...props }) {
  // console.log('SORTABLE CARD ITEMS: ', items)

  const { setNodeRef } = useDroppable({ id })

  const sortedChildren = Children.toArray(children).sort(
    (a, b) => items.indexOf(a.props.id) - items.indexOf(b.props.id)
  )

  // console.log('SORTED CHILDREN: ', children, sortedChildren)

  return (
    <SortableContext id={id} items={items} strategy={verticalListSortingStrategy}>
      <Card data-sortable-id={id} gap="0" ref={setNodeRef} {...props}>
        {sortedChildren}
      </Card>
    </SortableContext>
  )
}
SortableCard.displayName = 'Card'

export function SortableSubtitle(props) {
  return <SortableItem component={Card.Subtitle} {...props} />
}
SortableSubtitle.displayName = 'Card.Subtitle'

export function SortableTitle(props) {
  return <SortableItem component={Card.Title} {...props} />
}
SortableTitle.displayName = 'Card.Title'

export function SortablePrimary(props) {
  return <SortableItem component={Button.Primary} {...props} />
}
SortablePrimary.displayName = 'Button.Primary'

export function SortableSecondary(props) {
  return <SortableItem component={Button.Secondary} {...props} />
}
SortableSecondary.displayName = 'Button.Secondary'

export function SortableRow({ children, id, items = [], ...props }) {
  const { active, attributes, isDragging, isOver, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
    })

  const sortedChildren = Children.toArray(children).sort(
    (a, b) => items.indexOf(a.props.id) - items.indexOf(b.props.id)
  )

  const style = {
    backgroundColor: isOver ? '#F7F7F7' : 'transparent',
    cursor: isDragging ? 'grabbing' : 'grab',
    minHeight: active != null ? '40px' : 'auto',
    opacity: isDragging ? 0 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <SortableContext id={id} items={items}>
      <Flex.Row
        data-sortable-id={id}
        gap="4"
        // minHeight="40px"
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        {...props}
      >
        {sortedChildren}
      </Flex.Row>
    </SortableContext>
  )
}
SortableCard.displayName = 'Flex.Row'
