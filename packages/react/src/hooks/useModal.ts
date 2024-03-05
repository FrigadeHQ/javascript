import { useContext, useEffect, useState } from 'react'

import { FrigadeContext } from '../components/Provider'
import type { Flow } from '@frigade/js'

export function useModal(flow: Flow, isModal: boolean = true) {
  const { currentModal, modals, setModals } = useContext(FrigadeContext)
  const [isCurrentModal, setIsCurrentModal] = useState(false)

  useEffect(() => {
    if (isModal && flow?.isVisible && flow && !modals.has(flow.id)) {
      setModals((prevModals) => new Set(prevModals).add(flow.id))
    }
  }, [flow?.id, flow?.isVisible])

  useEffect(() => {
    const newIsCurrentModal = currentModal === flow?.id

    if (isModal && flow?.id != null && newIsCurrentModal !== isCurrentModal) {
      setIsCurrentModal(newIsCurrentModal)
    }
  }, [flow?.id, currentModal])

  function removeModal() {
    if (!isModal) return
    if (modals.has(flow?.id)) {
      setModals((prevModals) => {
        const nextModals = new Set(prevModals)
        nextModals.delete(flow?.id)

        return nextModals
      })
    }
  }

  return {
    isCurrentModal: isCurrentModal || !isModal,
    removeModal,
  }
}
