function isObject(obj) {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
}

export function deepmerge(...args) {
  const target = args.shift()

  // Recurse to the right until we've merged all the way back to a single target and source
  const source = args.length === 1 ? args[0] : deepmerge(...args)

  if (!isObject(target) || !isObject(source)) {
    throw new Error('deepmerge can only merge Objects')
  }

  const result = structuredClone(target)

  Object.entries(source).forEach(([key, value]) => {
    // Is value an Object, i.e. are we at risk of passing by reference?
    if (isObject(value)) {
      // Does key already exist in result?
      if (result[key] !== undefined) {
        // Deepmerge it on
        Object.assign(result, { [key]: deepmerge(result[key], structuredClone(value)) })
      } else {
        // Else clone value onto result
        Object.assign(result, { [key]: structuredClone(value) })
      }
    } else if (Array.isArray(value)) {
      // Does key already exist in result?
      if (result[key] !== undefined) {
        // Clone and spread onto existing
        // TODO: This only shallow-merges arrays. Add ability to deep merge here, so nested structures aren't overwritten
        Object.assign(result, { [key]: [...result[key], ...structuredClone(value)] })
      } else {
        // Else spread array onto result
        Object.assign(result, { [key]: structuredClone(value) })
      }
    } else {
      // Assign value onto result
      Object.assign(result, { [key]: value })
    }
  })

  return result
}
