import { Box } from '@/components/Box'

import { useEditorContext } from '@/components/Editor/useEditorContext'
import { flatDeserialize } from '@/components/Editor/serializer'

export function EditorPreview() {
  const { selectedId, serializedTree, setSelectedId } = useEditorContext()

  function handleSelectElement(e) {
    const sortableId = findClosestSortableId(e.target)

    if (sortableId !== null) {
      setSelectedId(sortableId)
    }
  }

  function findClosestSortableId(element: Element) {
    if (element.hasAttribute('data-sortable-id')) {
      return element.getAttribute('data-sortable-id')
    }

    if (element.parentElement != null) {
      return findClosestSortableId(element.parentElement)
    }

    return null
  }

  const deserializedTree = flatDeserialize(serializedTree)

  return (
    <Box
      css={{
        [`& [data-sortable-id="${selectedId}"]`]: {
          position: 'relative',
          '&:after': {
            borderRadius: 0,
            content: '""',
            display: 'block',
            inset: '-1px',
            outline: 'solid #B026FF',
            pointerEvents: 'none',
            position: 'absolute',
          },
        },
      }}
      onClick={handleSelectElement}
    >
      {deserializedTree}
    </Box>
  )
}
