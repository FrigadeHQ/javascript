import { useEffect, useState } from 'react'
import { useFrigade } from '@/hooks/useFrigade'

export function ImagePreloader() {
  const [hasPreloaded, setHasPreloaded] = useState(false)
  const { frigade } = useFrigade()

  useEffect(() => {
    ;(async () => {
      if (hasPreloaded) {
        return
      }
      setHasPreloaded(true)
      const flows = await frigade.getFlows()
      flows.forEach((flow) => {
        flow.steps.forEach((step) => {
          if (step.imageUri) {
            const img = new Image()
            img.src = step.imageUri
          }
        })
      })
    })()
  }, [])

  return <></>
}
