import { useEffect, useState } from 'react'

function checkElementForAnchor(element: Element, anchor: string) {
  try {
    if (element.matches(anchor) && isVisible(element)) {
      return element
    }

    const anchorSelector = element.querySelectorAll(anchor)

    if (anchorSelector.length > 0 && isVisible(anchorSelector[0])) {
      return anchorSelector[0]
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

export function useMutationAwareAnchor(anchor: string) {
  const [anchorElement, setAnchorElement] = useState(null)

  useEffect(() => {
    if (typeof anchor !== 'string') {
      return
    }

    try {
      const element = document.querySelector(anchor)

      if (element != null) {
        console.debug(`[frigade] Found anchor: ${anchor}`)
        setAnchorElement(element)
      } else {
        console.debug(`[frigade] No anchor found for selector: ${anchor}`)
      }
    } catch (invalidSelector) {
      console.debug(`[frigade] Invalid selector for anchor: ${anchor}`)
    }
  }, [anchor])

  useEffect(() => {
    if (typeof anchor !== 'string') {
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

          const maybeAnchor = checkElementForAnchor(node as Element, anchor)

          if (maybeAnchor != null) {
            console.debug(`[frigade] Found anchor: ${anchor}`)
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
            console.debug(`[frigade] Removed anchor: ${anchor}`)
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
