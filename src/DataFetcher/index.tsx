import React, { FC, useContext, useEffect } from 'react'
import { useFlows } from '../api/flows'
import { FrigadeContext } from '../FrigadeProvider'
import { useUser } from '../api/users'
import uuid from 'uuid'

interface DataFetcherProps {}

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
      setUserId('guest_' + uuid.v4())
    }
  }

  useEffect(() => {
    prefetchFlows()
    generateGuestUserId()
  }, [])
  return <></>
}
