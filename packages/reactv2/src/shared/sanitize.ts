import DOMPurify from 'dompurify'

export function sanitize(dirty?: string) {
  if (!dirty) {
    return { __html: '' }
  }

  if (typeof window === 'undefined') {
    // NOTE: JSDOM is required inline because it has import side effects that depend on node
    const { JSDOM } = require('jsdom')
    const window = new JSDOM('<!DOCTYPE html>').window
  }

  return {
    __html: DOMPurify(window).sanitize(dirty, {
      ALLOWED_TAGS: [
        'b',
        'i',
        'a',
        'span',
        'div',
        'p',
        'pre',
        'u',
        'br',
        'img',
        'code',
        'li',
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
      ],
    }),
  }
}
