import { useContext } from 'react'

import { EditorContext, type EditorContextType } from '@/components/Editor/EditorContext'

export { EditorContextType }

export function useEditorContext() {
  return useContext(EditorContext)
}
