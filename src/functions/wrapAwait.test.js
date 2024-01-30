import { countMatches } from 'test-filesystem'
import wrapAwait from './wrapAwait'

const noWrapContent = 'const sayHello = () => console.log(\'hello\')\n' +
  '\n' +
  'export default sayHello'

const wrapContent = 'await import(\'./sayHello\')\n'

describe('wrapAwait', () => {
  test('does not wrap if not needed', () => {
    expect(wrapAwait(noWrapContent, 'no-wrap-file')).toEqual(noWrapContent)
  })

  test('applies wrap if await found', () => {
    expect(countMatches(wrapAwait(wrapContent, 'do-wrap-file'), 'async function exportDoWrapFile () {')).toBe(1)
  })
})
