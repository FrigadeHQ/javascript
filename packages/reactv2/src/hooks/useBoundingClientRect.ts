import { useCallback, useLayoutEffect, useState } from 'react'

export function useBoundingClientRect() {
  const initialRect =
    'DOMRect' in globalThis
      ? new DOMRect()
      : {
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
  const [rect, setRect] = useState(initialRect)
  const [node, setNode] = useState(null)

  const ref = useCallback((node: HTMLElement) => {
    setNode(node)
  }, [])

  useLayoutEffect(() => {
    if (!node) return

    setRect(node.getBoundingClientRect())
  }, [node])

  return {
    rect,
    ref,
  }
}
