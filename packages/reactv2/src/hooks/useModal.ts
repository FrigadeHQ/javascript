import { useContext, useEffect, useState } from 'react'

import { FrigadeContext } from '../components/Provider'

export function useModal(flowId: string) {
  const { modals, setModals } = useContext(FrigadeContext)
  const [isCurrentModal, setIsCurrentModal] = useState(false)

  useEffect(() => {
    setModals([...modals, flowId])

    return () => setModals(modals.filter((v) => v !== flowId))
  }, [])

  useEffect(() => {
    const newIsCurrentModal = modals[0] === flowId

    if (newIsCurrentModal !== isCurrentModal) {
      setIsCurrentModal(newIsCurrentModal)
    }
  }, [modals])

  return {
    isCurrentModal,
  }
}
