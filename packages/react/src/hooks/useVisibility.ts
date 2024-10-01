import { ClientRectObject } from '@floating-ui/react'
import { useEffect, useState } from 'react'

import { EmptyDOMRect } from '@/hooks/useBoundingClientRect'

export function useVisibility(element: Element | null) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [clientRect, setClientRect] = useState<ClientRectObject>(EmptyDOMRect)

  const hasDimensions = clientRect.height > 0 && clientRect.width > 0

  useEffect(() => {
    if (element == null) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const el = entries[0]

        setClientRect(el.boundingClientRect)
        setIsIntersecting(el.isIntersecting)
      },
      { root: null }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [element])

  return {
    isVisible: isIntersecting && hasDimensions,
  }
}
