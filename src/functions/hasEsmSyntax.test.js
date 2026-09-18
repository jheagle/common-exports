import { hasEsmSyntax } from './hasEsmSyntax'

describe('hasEsmSyntax', () => {
  test('detects a bare export default with no "from" clause', () => {
    expect(hasEsmSyntax('const foo = () => {}\nexport default foo\n')).toBeTruthy()
  })

  test('detects a bare export const with no "from" clause', () => {
    expect(hasEsmSyntax('export const foo = () => {}\n')).toBeTruthy()
  })

  test('detects export ... from', () => {
    expect(hasEsmSyntax('export { foo } from \'./bar.js\'\n')).toBeTruthy()
  })

  test('detects import ... from', () => {
    expect(hasEsmSyntax('import foo from \'bar\'\n')).toBeTruthy()
  })

  test('does not detect plain CommonJS content', () => {
    const content = '\'use strict\';\nconst execa = require(\'execa\');\nmodule.exports = execa;\n'
    expect(hasEsmSyntax(content)).toBeFalsy()
  })

  test('does not false-positive on "export"/"import" appearing mid-line', () => {
    const content = 'const message = \'please export or import this data\'\nmodule.exports = message\n'
    expect(hasEsmSyntax(content)).toBeFalsy()
  })
})
