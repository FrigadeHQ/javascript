import { useContext } from 'react'
import { FrigadeContext } from '../FrigadeProvider'

export function useFlowOpens() {
  const { openFlowStates, setOpenFlowStates, hasActiveFullPageFlow } = useContext(FrigadeContext)

  function getOpenFlowState(flowSlug: string, defaultValue = false) {
    return openFlowStates[flowSlug] ?? defaultValue
  }

  function setOpenFlowState(flowSlug: string, isOpen: boolean) {
    setOpenFlowStates((prev) => ({ ...prev, [flowSlug]: isOpen }))
  }

  function resetOpenFlowState(flowSlug: string) {
    setOpenFlowStates((prev) => {
      const { [flowSlug]: _, ...rest } = prev
      return { ...rest }
    })
  }

  function hasOpenModals() {
    return Object.values(openFlowStates).some((isOpen) => isOpen) || hasActiveFullPageFlow
  }

  return {
    getOpenFlowState,
    setOpenFlowState,
    resetOpenFlowState,
    hasOpenModals,
  }
}
