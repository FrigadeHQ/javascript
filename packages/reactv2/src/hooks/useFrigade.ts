import { useContext } from 'react'

import { FrigadeContext } from '../components/Provider'

export function useFrigade() {
  const { frigade } = useContext(FrigadeContext)

  return { frigade }
}
