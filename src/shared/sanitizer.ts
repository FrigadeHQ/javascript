import DOMPurify from 'dompurify'

export function sanitize(dirty: string) {
  return {
    __html: DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: ['b', 'i', 'a', 'span', 'div', 'p', 'pre', 'u', 'br', 'img', 'code'],
      ALLOWED_ATTR: ['style', 'class', 'target', 'id', 'href', 'alt', 'src'],
    }),
  }
}
