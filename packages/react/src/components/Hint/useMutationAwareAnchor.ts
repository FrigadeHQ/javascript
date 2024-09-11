import { useEffect, useState } from 'react'

function checkElementForAnchor(element: Element, anchor: string) {
  if (element.matches(anchor)) {
    if (isVisible(element)) {
      return element
    } else {
      return null
    }
  }

  const anchorSelector = element.querySelectorAll(anchor)

  if (anchorSelector.length > 0) {
    if (isVisible(anchorSelector[0])) {
      return anchorSelector[0]
    } else {
      return null
    }
  }

  return null
}

function isVisible(element: Element) {
  if (!(element instanceof HTMLElement)) {
    return false
  }

  return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length)
}

export function useMutationAwareAnchor(anchor: string) {
  const [anchorElement, setAnchorElement] = useState(null)

  useEffect(() => {
    const element = document.querySelector(anchor)

    if (element != null) {
      setAnchorElement(element)
    }
  }, [anchor])

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== 'childList') {
          continue
        }

        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) {
            continue
          }

          const maybeAnchor = checkElementForAnchor(node as Element, anchor)

          if (maybeAnchor != null) {
            setAnchorElement(maybeAnchor)
            break
          }
        }

        for (const node of mutation.removedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) {
            continue
          }

          const maybeAnchor = checkElementForAnchor(node as Element, anchor)

          if (maybeAnchor != null) {
            setAnchorElement(null)
            break
          }
        }
      }
    })

    observer.observe(document.querySelector('body'), { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [anchor])

  return {
    anchorElement,
  }
}
