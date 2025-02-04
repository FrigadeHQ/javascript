import { useEffect, useState } from 'react'

export function useAutoScroll(
  element: Element | null | undefined,
  enabled: boolean | ScrollIntoViewOptions = true
) {
  const [scrollComplete, setScrollComplete] = useState(false)

  useEffect(() => {
    if (!scrollComplete && enabled && element instanceof Element) {
      const scrollOptions: ScrollIntoViewOptions =
        typeof enabled !== 'boolean' ? enabled : { behavior: 'smooth', block: 'center' }

      /*
       * NOTE: "scrollend" event isn't supported widely enough yet :(
       *
       * We'll listen to a capture-phase "scroll" instead, and when it stops
       * bouncing, we can infer that the scroll we initiated is over.
       */
      let scrollTimeout: ReturnType<typeof setTimeout>
      window.addEventListener(
        'scroll',
        function scrollHandler() {
          clearTimeout(scrollTimeout)
          scrollTimeout = setTimeout(() => {
            window.removeEventListener('scroll', scrollHandler)
            setScrollComplete(true)
          }, 100)
        },
        true
      )

      element.scrollIntoView(scrollOptions)
    } else if (!enabled) {
      setScrollComplete(true)
    }
  }, [enabled, element, scrollComplete])
}
