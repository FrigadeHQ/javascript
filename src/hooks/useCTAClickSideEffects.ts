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
    // Check if url starts with http -- if so, default to _blank otherwise default to _self
    let updatedTarget = url.startsWith('http') ? '_blank' : '_self'

    if (target && target !== '_blank') {
      updatedTarget = '_self'
    }
    context.navigate(url, updatedTarget)
  }

  return {
    primaryCTAClickSideEffects,
    secondaryCTAClickSideEffects,
    handleUrl,
  }
}
