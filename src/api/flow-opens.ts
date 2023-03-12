import { useContext } from 'react'
import { FrigadeContext } from '../FrigadeProvider'

export function useFlowOpens() {
  const { openFlowStates, setOpenFlowStates, hasActiveFullPageFlow } = useContext(FrigadeContext)

  function getOpenFlowState(flowSlug: string) {
    return openFlowStates[flowSlug] ?? false
  }

  function setOpenFlowState(flowSlug: string, isOpen: boolean) {
    setOpenFlowStates({
      ...openFlowStates,
      [flowSlug]: isOpen,
    })
  }

  function hasOpenModals() {
    return Object.values(openFlowStates).some((isOpen) => isOpen) || hasActiveFullPageFlow
  }

  return {
    getOpenFlowState,
    setOpenFlowState,
    hasOpenModals,
  }
}
