import { deepmerge } from './deepmerge'

describe('deepmerge', () => {
  it('only merges objects', () => {
    const objectA = { foo: null }
    const notAnObjectA = null
    const notAnObjectB = 'foo'

    expect(() => deepmerge(objectA, notAnObjectA)).toThrow()
    expect(() => deepmerge(objectA, notAnObjectB)).toThrow()
    expect(() => deepmerge(notAnObjectA, objectA)).toThrow()
    expect(() => deepmerge(notAnObjectB, objectA)).toThrow()
    expect(() => deepmerge(notAnObjectA, notAnObjectB)).toThrow()
  })

  it('merges flat objects', () => {
    const objectA = { foo: null }
    const objectB = { bar: 1 }
    const objectC = { foo: null, bar: 1 }

    const result = deepmerge(objectA, objectB)

    expect(result).toStrictEqual(objectC)
  })

  it('merges deep objects', () => {
    const objectA = { foo: null, bar: { baz: null } }
    const objectB = { quux: 1, bar: { fnord: 2 } }
    const objectC = { foo: null, bar: { baz: null, fnord: 2 }, quux: 1 }

    const result = deepmerge(objectA, objectB)

    expect(result).toStrictEqual(objectC)
  })

  it('does not alter source or target objects', () => {
    const objectA = { foo: null, bar: { baz: null } }
    const objectB = { quux: 1, bar: { fnord: 2 } }

    deepmerge(objectA, objectB)

    expect(objectA).toStrictEqual({ foo: null, bar: { baz: null } })
    expect(objectB).toStrictEqual({ quux: 1, bar: { fnord: 2 } })
  })

  it('passes objects by value', () => {
    const objectA = { foo: null, bar: { baz: null } }
    const objectB = { quux: 1, bar: { fnord: 2 } }

    const result = deepmerge(objectA, objectB)

    result.bar.baz = 'changed'
    result.bar.fnord = 'alsoChanged'

    expect(objectA.bar.baz).toStrictEqual(null)
    expect(objectB.bar.fnord).toStrictEqual(2)
  })

  it('merges child arrays', () => {
    const objectA = { foo: null, bar: ['baz'] }
    const objectB = { quux: 1, bar: ['fnord'] }

    const result = deepmerge(objectA, objectB)

    expect(result.bar).toStrictEqual(['baz', 'fnord'])
  })

  it('handles more than two arguments', () => {
    const objectA = { foo: null, bar: { baz: null } }
    const objectB = { quux: 1, bar: { fnord: 2 } }
    const objectC = { ran: { out: 'of words' } }
    const objectD = { foo: null, bar: { baz: null, fnord: 2 }, quux: 1, ran: { out: 'of words' } }

    const result = deepmerge(objectA, objectB, objectC)

    expect(result).toStrictEqual(objectD)
  })
})
