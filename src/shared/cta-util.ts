import { StepData } from '../types'

export function primaryCTAClickSideEffects(step: StepData) {
  if (step.url) {
    window.open(step.url, step.urlTarget ?? '_blank')
  }
  if (step.primaryButtonUri) {
    if (step.primaryButtonUriTarget && step.primaryButtonUriTarget !== '_blank') {
      window.location.href = step.primaryButtonUri
    } else {
      window.open(step.primaryButtonUri)
    }
  }
}

export function secondaryCTAClickSideEffects(step: StepData) {
  if (step.url) {
    window.open(step.url, step.urlTarget ?? '_blank')
  }
  if (step.secondaryButtonUri) {
    if (
      step.secondaryButtonUriTarget &&
      step.secondaryButtonUriTarget !== '_blank'
    ) {
      window.location.href = step.secondaryButtonUri
    } else {
      window.open(step.secondaryButtonUri)
    }
  }
}
