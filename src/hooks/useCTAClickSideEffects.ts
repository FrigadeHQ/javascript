import { StepData } from '../types'
import { FrigadeContext } from '../FrigadeProvider'
import { useContext } from 'react'

export function useCTAClickSideEffects() {
  const context = useContext(FrigadeContext)

  function primaryCTAClickSideEffects(step: StepData) {
    handleUrl(step.primaryButtonUri, step.primaryButtonUriTarget)
  }

  function secondaryCTAClickSideEffects(step: StepData) {
    handleUrl(step.secondaryButtonUri, step.secondaryButtonUriTarget)
  }

  function handleUrl(url?: string, target?: string) {
    if (!url) {
      return
    }
    let updatedTarget = '_self'
    if (target && target === '_blank') {
      updatedTarget = '_blank'
    }
    context.navigate(url, updatedTarget)
  }

  return {
    primaryCTAClickSideEffects,
    secondaryCTAClickSideEffects,
  }
}
