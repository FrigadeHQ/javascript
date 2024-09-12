import { useCallback, useEffect } from 'react'
import type { Flow } from '@frigade/js'

export const globalModalState: Set<string> = new Set()

export function useModal(flow: Flow, isModal: boolean = true) {
  const removeModal = useCallback(() => {
    if (globalModalState.has(flow?.id)) {
      globalModalState.delete(flow?.id)
    }
  }, [globalModalState, isModal])

  const registerModal = useCallback(() => {
    if (isModal && flow?.isVisible && !globalModalState.has(flow.id)) {
      globalModalState.add(flow.id)
    }
  }, [globalModalState, isModal])

  useEffect(() => {
    return () => {
      removeModal()
    }
  }, [])

  useEffect(() => {
    registerModal()

    const handleRouteChange = () => {
      removeModal()
    }

    window.addEventListener('popstate', handleRouteChange)
    window.addEventListener('beforeunload', handleRouteChange)

    return () => {
      removeModal()
      window.removeEventListener('popstate', handleRouteChange)
      window.removeEventListener('beforeunload', handleRouteChange)
    }
  }, [registerModal, removeModal])

  if (!flow?.isVisible) {
    removeModal()
  } else {
    registerModal()
  }

  const currentModal = globalModalState.size > 0 ? globalModalState.values().next().value : null

  return {
    isCurrentModal: !isModal ? true : currentModal === flow?.id || globalModalState.size == 0,
  }
}
