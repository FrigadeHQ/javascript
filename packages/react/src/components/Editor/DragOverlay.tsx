import { DragOverlay as DndDragOverlay } from '@dnd-kit/core'

import { useEditorContext } from '@/components/Editor/useEditorContext'

import { componentMap, hydrateElement } from '@/components/Editor/serializer'

export function DragOverlay() {
  const { activeId, serializedTree } = useEditorContext()

  function getDragOverlay(elementId) {
    if (serializedTree.elements[elementId] != null) {
      return hydrateElement({
        components: componentMap,
        elementId,
        elements: serializedTree.elements,
      })
    }

    return null
  }

  return <DndDragOverlay>{getDragOverlay(activeId)}</DndDragOverlay>
}
