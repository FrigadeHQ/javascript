export function flattenObject(obj: Record<any, any>, path = '', separator = '.') {
  return Object.keys(obj).reduce((acc, k) => {
    const prefix = path.length ? `${path}${separator}` : ''
    const currentPath = `${prefix}${k}`
    const currentValue = obj[k]

    if (typeof currentValue === 'object' && currentValue !== null && !Array.isArray(currentValue)) {
      Object.assign(acc, flattenObject(currentValue, currentPath, separator))
    } else {
      acc[currentPath] = currentValue
    }

    return acc
  }, {})
}
