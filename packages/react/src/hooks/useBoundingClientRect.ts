import { useCallback, useLayoutEffect, useState } from 'react'

export const EmptyDOMRect = {
  height: 0,
  width: 0,
  x: 0,
  y: 0,
  bottom: 0,
  top: 0,
  right: 0,
  left: 0,
  toJSON: () => {},
}

export function useBoundingClientRect() {
  const initialRect = 'DOMRect' in globalThis ? new DOMRect() : EmptyDOMRect
  const [rect, setRect] = useState(initialRect)
  const [node, setNode] = useState(null)

  const ref = useCallback((node: Element) => {
    setNode(node)
  }, [])

  useLayoutEffect(() => {
    if (!node) return

    const handleResize = () => {
      const newRect = node.getBoundingClientRect()
      setRect(newRect)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [node])

  return {
    node,
    rect,
    ref,
  }
}
