import { useEffect, useState } from 'react'
import Sizzle from 'sizzle'

function checkElementForAnchor(element: Element, anchorSelector: string) {
  try {
    if (Sizzle.matchesSelector(element, anchorSelector) && isVisible(element)) {
      return element
    }

    const anchorElements = Sizzle(anchorSelector, element)

    if (anchorElements.length > 0 && isVisible(anchorElements[0])) {
      return anchorElements[0]
    }
  } catch (invalidSelector) {
    return null
  }
}

function isVisible(element: Element) {
  if (!(element instanceof HTMLElement)) {
    return false
  }

  return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length)
}

export function useMutationAwareAnchor(anchorSelector: string) {
  const [anchorElement, setAnchorElement] = useState(null)

  useEffect(() => {
    if (typeof anchorSelector !== 'string') {
      return
    }

    try {
      const element = Sizzle(anchorSelector)[0]

      if (element != null) {
        console.debug(`[frigade] Found anchor: ${anchorSelector}`)
        setAnchorElement(element)
      } else {
        console.debug(`[frigade] No anchor found for selector: ${anchorSelector}`)
      }
    } catch (invalidSelector) {
      console.debug(`[frigade] Invalid selector for anchor: ${anchorSelector}`)
    }
  }, [anchorSelector])

  useEffect(() => {
    if (typeof anchorSelector !== 'string') {
      return
    }

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== 'childList') {
          continue
        }

        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) {
            continue
          }

          const maybeAnchor = checkElementForAnchor(node as Element, anchorSelector)

          if (maybeAnchor != null) {
            console.debug(`[frigade] Found anchor: ${anchorSelector}`)
            setAnchorElement(maybeAnchor)
            break
          }
        }

        for (const node of mutation.removedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) {
            continue
          }

          const maybeAnchor = checkElementForAnchor(node as Element, anchorSelector)

          if (maybeAnchor != null) {
            console.debug(`[frigade] Removed anchor: ${anchorSelector}`)
            setAnchorElement(null)
            break
          }
        }
      }
    })

    observer.observe(document.querySelector('body'), { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [anchorSelector])

  return {
    anchorElement,
  }
}
