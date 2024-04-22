import DOMPurify from 'dompurify'

function getWindow() {
  if (typeof window === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires -- JSDOM is required inline because it has import side effects that depend on node
    const { JSDOM } = require('jsdom')
    return new JSDOM('<!DOCTYPE html>').window
  }

  return window
}

export function sanitize(dirty?: string) {
  if (!dirty) {
    return { __html: '' }
  }

  return {
    __html: DOMPurify(getWindow()).sanitize(dirty, {
      ALLOWED_TAGS: [
        'b',
        'strong',
        'i',
        'em',
        'a',
        'span',
        'div',
        'p',
        'pre',
        's',
        'u',
        'br',
        'img',
        'code',
        'li',
        'ol',
        'ul',
        'table',
        'tbody',
        'thead',
        'tr',
        'td',
        'th',
        'h1',
        'h2',
        'h3',
        'h4',
        'video',
        'p',
      ],
      ALLOWED_ATTR: [
        'style',
        'class',
        'target',
        'id',
        'href',
        'alt',
        'src',
        'controls',
        'autoplay',
        'loop',
        'muted',
        'playsinline',
      ],
    }),
  }
}
