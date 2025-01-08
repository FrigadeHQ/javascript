import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export function useClientPortal(
  children: React.ReactNode,
  container: Element | DocumentFragment | string,
  key?: null | string
) {
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<Element | DocumentFragment>()

  useEffect(() => {
    containerRef.current =
      typeof container === 'string' ? document.querySelector(container) : container
    setMounted(true)
  }, [container])

  return mounted ? createPortal(children, containerRef.current, key) : null
}
