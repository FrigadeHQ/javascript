import { StepData } from '../types'

export function primaryCTAClickSideEffects(step: StepData) {
  handleUrl(step.primaryButtonUri, step.primaryButtonUriTarget)
}

export function secondaryCTAClickSideEffects(step: StepData) {
  handleUrl(step.secondaryButtonUri, step.secondaryButtonUriTarget)
}

export function handleUrl(url?: string, target?: string) {
  if (!url) {
    return
  }
  if (target && target !== '_blank') {
    window.location.href = url
  } else {
    window.open(url)
  }
}
