import { useCallback, useEffect } from 'react'
import type { Flow } from '@frigade/js'

export let globalModalState: Set<string> = new Set()

export function useModal(flow: Flow, isModal: boolean = true) {
  const removeModal = useCallback(() => {
    if (globalModalState.has(flow?.id)) {
      globalModalState.delete(flow?.id)
    }
  }, [globalModalState, isModal])

  const registerModal = useCallback(() => {
    if (isModal && flow?.isVisible && flow && !globalModalState.has(flow.id)) {
      globalModalState.add(flow.id)
    }
  }, [globalModalState, isModal])

  useEffect(() => {
    return () => {
      removeModal()
    }
  }, [])

  if (!flow?.isVisible) {
    removeModal()
  } else {
    registerModal()
  }

  const currentModal = globalModalState.size > 0 ? globalModalState.values().next().value : null

  return {
    isCurrentModal: !isModal ? true : currentModal === flow?.id,
  }
}
