import { useContext, useEffect } from 'react'

import { FrigadeContext } from '@/components/Provider'
import type { Flow } from '@frigade/js'

export function useModal(flow: Flow, isModal: boolean = true) {
  const { currentModal, modals, setModals } = useContext(FrigadeContext)

  useEffect(() => {
    if (isModal && flow?.isVisible && flow && !modals.has(flow.id)) {
      setModals((prevModals) => new Set(prevModals).add(flow.id))
    }

    return () => {
      if (isModal) {
        setModals((prevModals) => {
          const nextModals = new Set(prevModals)
          nextModals.delete(flow?.id)

          return nextModals
        })
      }
    }
  }, [flow?.id, flow?.isVisible])

  function removeModal() {
    if (modals.has(flow?.id)) {
      setTimeout(() => {
        setModals((prevModals) => {
          const nextModals = new Set(prevModals)
          nextModals.delete(flow?.id)

          return nextModals
        })
      }, 0)
    }
  }

  return {
    isCurrentModal: !isModal ? true : currentModal === flow?.id,
    removeModal,
  }
}
