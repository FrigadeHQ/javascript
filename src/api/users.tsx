import React, { useContext } from 'react'
import { FrigadeContext } from '../FrigadeProvider'

export function useUser() {
  const { userId, setUserId } = useContext(FrigadeContext)

  return { userId, setUserId }
}
