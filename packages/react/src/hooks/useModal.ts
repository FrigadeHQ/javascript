import { useCallback, useContext, useEffect } from 'react'
import type { Flow } from '@frigade/js'

import { FrigadeContext } from '@/components/Provider'

export function useCheckForModalCollision(flow: Flow, isModal = true) {
  const { currentModal, setCurrentModal } = useContext(FrigadeContext)

  const claimLock = useCallback(
    (flowId: string) => {
      if (isModal && flow?.isVisible) {
        setCurrentModal(flowId)
      }
    },
    [isModal, flow?.isVisible, setCurrentModal]
  )

  const releaseLock = useCallback(() => {
    if (flow != null && currentModal === flow?.id) {
      setCurrentModal(null)
    }
  }, [currentModal, flow, setCurrentModal])

  useEffect(() => {
    if (flow != null && currentModal === null && flow.isVisible) {
      claimLock(flow.id)
    }

    return releaseLock
  }, [claimLock, currentModal, flow, releaseLock])

  // Edge case: The current modal may become non-modal while still mounted
  useEffect(() => {
    if (flow != null && (!isModal || !flow.isVisible)) {
      releaseLock()
    }
  }, [flow, isModal, releaseLock])

  // No flow? No problem.
  if (flow == null) {
    return {
      hasModalCollision: false,
    }
  }

  // Non-modal and hidden components, by definition, can't collide with modals
  if (!isModal || !flow.isVisible) {
    return {
      hasModalCollision: false,
    }
  }

  // We already have the lock, send it
  if (currentModal === flow.id) {
    return {
      hasModalCollision: false,
    }
  }

  if (currentModal === null) {
    return {
      hasModalCollision: false,
    }
  }

  // If we didn't short circuit and didn't have the lock, assume that we're out of lock luck.
  return {
    hasModalCollision: true,
  }
}
