import React, { FC, useContext, useEffect } from 'react'
import { useFlows } from '../api/flows'
import { FrigadeContext } from '../FrigadeProvider'
import { useUser } from '../api/users'
import { v4 as uuidv4 } from 'uuid'

interface DataFetcherProps {}

const guestUserIdField = 'xFrigade_guestUserId'

export const DataFetcher: FC<DataFetcherProps> = ({}) => {
  const { getFlows } = useFlows()
  const { userId, setUserId } = useUser()
  const { setFlows, setHasLoadedData } = useContext(FrigadeContext)

  async function prefetchFlows() {
    const flows = await getFlows()
    if (flows && flows?.data) {
      setFlows(flows.data)
      setHasLoadedData(true)
    } else {
      console.error('Failed to prefetch flows')
    }
  }

  function generateGuestUserId() {
    // If userId is null, generate a guest user id using uuid
    if (userId === null) {
      // Call local storage to see if we already have a guest user id
      const guestUserId = localStorage.getItem(guestUserIdField)
      if (guestUserId) {
        setUserId(guestUserId)
        return
      }
      // If we don't have a guest user id, generate one and save it to local storage
      const newGuestUserId = 'guest_' + uuidv4()
      localStorage.setItem(guestUserIdField, newGuestUserId)
      setUserId(newGuestUserId)
    }
  }

  useEffect(() => {
    prefetchFlows()
    generateGuestUserId()
  }, [])
  return <></>
}
