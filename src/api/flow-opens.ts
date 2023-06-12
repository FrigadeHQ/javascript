import { useContext } from 'react'
import { FrigadeContext } from '../FrigadeProvider'

export function useFlowOpens() {
  const {
    openFlowStates,
    setOpenFlowStates,
    hasActiveFullPageFlow,
    setCompletedFlowsToKeepOpenDuringSession,
    completedFlowsToKeepOpenDuringSession,
  } = useContext(FrigadeContext)

  function getOpenFlowState(flowId: string, defaultValue = false) {
    return openFlowStates[flowId] ?? defaultValue
  }

  function setOpenFlowState(flowId: string, isOpen: boolean) {
    setOpenFlowStates((prev) => ({ ...prev, [flowId]: isOpen }))
  }

  function resetOpenFlowState(flowId: string) {
    setOpenFlowStates((prev) => {
      const { [flowId]: _, ...rest } = prev
      return { ...rest }
    })
  }

  function setKeepCompletedFlowOpenDuringSession(flowId: string) {
    if (completedFlowsToKeepOpenDuringSession.includes(flowId)) {
      return
    }
    setCompletedFlowsToKeepOpenDuringSession((prev) => [...prev, flowId])
  }

  function shouldKeepCompletedFlowOpenDuringSession(flowId: string): boolean {
    return completedFlowsToKeepOpenDuringSession.includes(flowId)
  }

  function hasOpenModals() {
    return Object.values(openFlowStates).some((isOpen) => isOpen) || hasActiveFullPageFlow
  }

  return {
    getOpenFlowState,
    setOpenFlowState,
    resetOpenFlowState,
    hasOpenModals,
    setKeepCompletedFlowOpenDuringSession,
    shouldKeepCompletedFlowOpenDuringSession,
  }
}
