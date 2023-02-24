import { useContext } from 'react'
import { FrigadeContext } from '../FrigadeProvider'

export function useFlowOpens() {
  const { openFlowStates, setOpenFlowStates } = useContext(FrigadeContext)

  function getOpenFlowState(flowSlug: string) {
    return openFlowStates[flowSlug] ?? false
  }

  function setOpenFlowState(flowSlug: string, isOpen: boolean) {
    setOpenFlowStates({
      ...openFlowStates,
      [flowSlug]: isOpen,
    })
  }

  return {
    getOpenFlowState,
    setOpenFlowState,
  }
}
