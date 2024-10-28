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

export interface ComponentMap {
  [componentName: string]:
    | React.ComponentType<unknown>
    | {
        component: React.ComponentType<unknown>
        props?: Record<string, unknown>
      }
}

export const editorComponents: ComponentMap = {
  'Button.Primary': SortablePrimary,
  'Button.Secondary': SortableSecondary,
  Card: SortableCard,
  'Card.Title': SortableTitle,
  'Card.Subtitle': SortableSubtitle,
  'Flex.Row': SortableRow,
}

export function flatSerialize(
  element: React.JSX.Element,
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

export function flatDeserialize(template, components = editorComponents) {
  const parsed = typeof template === 'string' ? JSON.parse(template) : template

  return hydrateElement({ elementId: parsed.root, elements: parsed.elements, components })
}

export function hydrateElement({
  components,
  elementId,
  elements,
}: {
  components: ComponentMap
  elementId: string
  elements: SerializedTree['elements']
}) {
  const element = elements[elementId]
  const mappedComponent = components[element?.type]

  let finalComponent: React.ComponentType

  if ('component' in mappedComponent) {
    finalComponent = mappedComponent.component
  } else {
    finalComponent = mappedComponent
  }
  // const { component, props } = typeof components[element?.type] === 'function' ? { component: components[element?.type], props: { }} : components[element?.type] ?? {}

  if (element == null || finalComponent == null) {
    return null
  }

  const finalProps: Record<string, unknown> = {
    id: elementId,
    key: elementId,
    ...(element.props ?? {}),
    ...('props' in mappedComponent ? mappedComponent.props : {}),
  }

  if (Array.isArray(element.children)) {
    finalProps.children = element.children.map((childId) =>
      hydrateElement({ components, elementId: childId, elements })
    )
    finalProps.items = element.children
  } else {
    finalProps.children = element.children
  }

  return React.createElement(finalComponent, finalProps)
}
