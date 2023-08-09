import { getPositionStyle } from '../styles'

describe('getPositionStyle', () => {
  test('returns expected style', () => {
    const result = getPositionStyle('top-center')
    expect(result.left).toEqual(0)
    expect(result.right).toEqual(0)
  })

  test('applies offset', () => {
    const offset = '24px'
    const result = getPositionStyle('top-left', offset)
    expect(result.left).toEqual(offset)
    expect(result.right).toBeUndefined()
  })
})
