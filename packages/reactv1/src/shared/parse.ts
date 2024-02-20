/**
 * Safely parse a stringified JSON object.
 *
 * @param stringified A stringified JSON object (or other value)
 * @returns The parsed object or null if the stringified value is not a valid JSON object
 */
export function safeParse<R>(stringified: string): R | null {
  try {
    return JSON.parse(stringified) as R
  } catch (e) {
    console.error('Failed to parse Frigade config.yml to JSON', e)
    return null
  }
}
