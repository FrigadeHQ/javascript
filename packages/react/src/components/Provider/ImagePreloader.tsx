import { useEffect } from 'react'
import { useFrigade } from '@/hooks/useFrigade'

export function ImagePreloader() {
  const { frigade } = useFrigade()

  useEffect(() => {
    ;(async () => {
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

  return null
}
