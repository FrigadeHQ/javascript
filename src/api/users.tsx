import React, { useContext } from 'react'
import { FrigadeContext } from '../FrigadeProvider'

export function useUser() {
  const { userId, setUserId } = useContext(FrigadeContext)
  // TODO: if a user calls setUserId with a new value, call backend link the two user ids
  return { userId, setUserId }
}
