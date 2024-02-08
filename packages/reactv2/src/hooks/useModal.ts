import { useContext, useEffect, useState } from 'react'

import { FrigadeContext } from '../components/Provider'

export function useModal(modalId: string) {
  const { currentModal, modals, setModals } = useContext(FrigadeContext)
  const [isCurrentModal, setIsCurrentModal] = useState(false)

  useEffect(() => {
    if (modalId != null && !modals.has(modalId)) {
      setModals((prevModals) => new Set(prevModals).add(modalId))
    }
  }, [modalId])

  useEffect(() => {
    const newIsCurrentModal = currentModal === modalId

    if (modalId != null && newIsCurrentModal !== isCurrentModal) {
      setIsCurrentModal(newIsCurrentModal)
    }
  }, [modalId, currentModal])

  function removeModal() {
    if (modals.has(modalId)) {
      setModals((prevModals) => {
        const nextModals = new Set(prevModals)
        nextModals.delete(modalId)

        return nextModals
      })
    }
  }

  return {
    isCurrentModal,
    removeModal,
  }
}
