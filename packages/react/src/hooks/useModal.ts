import { useContext, useEffect } from 'react'

import { FrigadeContext } from '@/components/Provider'
import type { Flow } from '@frigade/js'

export function useModal(flow: Flow, isModal: boolean = true) {
  const { currentModal, modals, setModals } = useContext(FrigadeContext)

  useEffect(() => {
    if (isModal && flow?.isVisible && flow && !modals.has(flow.id)) {
      setModals((prevModals) => new Set(prevModals).add(flow.id))
    }
  }, [flow?.id, flow?.isVisible])

  function removeModal() {
    if (modals.has(flow?.id)) {
      setModals((prevModals) => {
        const nextModals = new Set(prevModals)
        nextModals.delete(flow?.id)

        return nextModals
      })
    }
  }

  return {
    isCurrentModal: !isModal ? true : currentModal === flow?.id,
    removeModal,
  }
}
