import * as React from 'react'

import { SortableCard, SortableSubtitle, SortableTitle } from './SortableCard'

export function flatSerialize(element, acc = {}, parent = null) {
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

export function flatDeserialize(serialized) {
  const parsed = typeof serialized === 'string' ? JSON.parse(serialized) : serialized

  return hydrateElement(parsed.root, parsed.elements)
}

export function hydrateElement(elementId, elements) {
  const element = elements[elementId]

  // console.log('#### HYDRATE: ', elementId, element, elements)

  const props = {
    ...(element.props ?? {}),
    key: elementId,
  }

  if (Array.isArray(element.children)) {
    props.children = element.children.map((childId) => hydrateElement(childId, elements))
    props.items = props.items ?? element.children
  } else {
    props.children = element.children
  }

  return React.createElement(componentMap[element.type], props)
}

export const componentMap = {
  Card: SortableCard,
  'Card.Title': SortableTitle,
  'Card.Subtitle': SortableSubtitle,
}
