import { useContext } from 'react'

import { FrigadeContext } from '@/components/Provider'
import { logOnce } from '../shared/log'

export function useFrigade() {
  const context = useContext(FrigadeContext)
  if (!context || !context.frigade) {
    logOnce('useFrigade() must be used in a child of the Frigade Provider', 'error')
  }

  const { frigade } = context

  return { frigade, isLoading: !frigade?.isReady() }
}
