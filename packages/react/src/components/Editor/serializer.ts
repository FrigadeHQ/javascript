import * as React from 'react'

import {
  SortableCard,
  SortablePrimary,
  SortableRow,
  SortableSecondary,
  SortableSubtitle,
  SortableTitle,
} from './SortableCard'

export interface SerializedTree {
  elements: Record<
    string,
    {
      children: string[]
      props: Record<string, unknown>
      type: string
    }
  >
  root: string
}

export const componentMap = {
  'Button.Primary': SortablePrimary,
  'Button.Secondary': SortableSecondary,
  Card: SortableCard,
  'Card.Title': SortableTitle,
  'Card.Subtitle': SortableSubtitle,
  'Flex.Row': SortableRow,
}

export function flatSerialize(
  element: React.ReactElement,
  acc = {},
  parent = null
): string | SerializedTree {
  if (typeof element === 'string') {
    return element
  }

  const key = element.key ?? element.props.id ?? crypto.randomUUID()

  if (parent != null) {
    parent.children.push(key)
  }

  const { children, ...props } = element.props ?? {}

  acc[key] = {
    // @ts-expect-error Need to use a type that includes displayName on ReactElement
    type: typeof element.type === 'string' ? element.type : element.type.displayName,
    props,
  }

  if (Array.isArray(children)) {
    acc[key].children = []

    for (const child of children) {
      flatSerialize(child, acc, acc[key])
    }
  } else if (typeof children === 'string') {
    acc[key].children = children
  } else if (children?.type?.displayName != null) {
    acc[key].children = []

    flatSerialize(children, acc, acc[key])
  }

  return {
    elements: acc,
    root: key,
  }
}

export function flatDeserialize(template, components = componentMap) {
  const parsed = typeof template === 'string' ? JSON.parse(template) : template

  return hydrateElement({ elementId: parsed.root, elements: parsed.elements, components })
}

export function hydrateElement({ components, elementId, elements }) {
  const element = elements[elementId]

  if (element == null) {
    return null
  }

  const props = {
    id: elementId,
    key: elementId,
    ...(element.props ?? {}),
  }

  if (Array.isArray(element.children)) {
    props.children = element.children.map((childId) =>
      hydrateElement({ components, elementId: childId, elements })
    )
    props.items = element.children
  } else {
    props.children = element.children
  }

  return React.createElement(components[element.type], props)
}
